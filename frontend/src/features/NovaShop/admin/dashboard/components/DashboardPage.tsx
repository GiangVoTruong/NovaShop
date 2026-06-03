import { Column } from '@ant-design/charts'
import { ArrowUpRight, DollarSign, Package, Plus, ShoppingCart, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Spin } from 'antd'
import { PATHS, adminOrderDetailPath } from '@/router/paths'
import { formatCurrency, formatDateTime, formatNumber } from '@/features/NovaShop/shared/format'
import type { AdminOrderResponse } from '@/types/admin.types'
import Button from '@/features/NovaShop/shared/ui/Button'
import { OrderStatusBadge } from '@/features/NovaShop/shared/ui/StatusBadge'
import AdminPage from '../../layout/components/AdminPage'
import AdminSection from '../../layout/components/AdminSection'
import AdminShell from '../../layout/components/AdminShell'
import AdminTable from '../../layout/components/AdminTable'
import StatCard from '../../layout/components/StatCard'
import { adminTableText } from '../../layout/constants/adminTableStyles'
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics'
import { useAdminOrders } from '../../hooks/useAdminOrders'
import { getAdminOrderCode, getAdminOrderTotal, toAdminOrderUiStatus, toAdminAmount } from '../../lib/adminApi'

export default function DashboardPage() {
  const { t: translate } = useTranslation()
  const analyticsQuery = useAdminAnalytics()
  const recentOrdersQuery = useAdminOrders({ page: 0, size: 5, sortBy: 'createdAt', sortDir: 'desc' })
  const overview = analyticsQuery.data
  const recentOrders = recentOrdersQuery.data?.data ?? []

  if (analyticsQuery.isLoading || !overview) {
    return (
      <AdminShell className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </AdminShell>
    )
  }

  const revenueChartData = overview.revenueByMonth.map((point) => ({
    month: point.month,
    value: toAdminAmount(point.revenue) / 1_000_000,
  }))

  const recentOrderColumns = [
    {
      title: translate('admin.dashboard.recentOrders.columns.code'),
      key: 'code',
      render: (_: unknown, order: AdminOrderResponse) => (
        <Link to={adminOrderDetailPath(order.id)} className={adminTableText.code}>
          {getAdminOrderCode(order)}
        </Link>
      ),
    },
    {
      title: translate('admin.dashboard.recentOrders.columns.customer'),
      key: 'customer',
      render: (_: unknown, order: AdminOrderResponse) => (
        <span className={adminTableText.primary}>{order.customerFullName}</span>
      ),
    },
    {
      title: translate('admin.dashboard.recentOrders.columns.total'),
      key: 'total',
      render: (_: unknown, order: AdminOrderResponse) => (
        <span className={adminTableText.money}>{formatCurrency(getAdminOrderTotal(order))}</span>
      ),
    },
    {
      title: translate('admin.dashboard.recentOrders.columns.status'),
      key: 'status',
      render: (_: unknown, order: AdminOrderResponse) => (
        <OrderStatusBadge status={toAdminOrderUiStatus(order.status)} />
      ),
    },
    {
      title: translate('admin.dashboard.recentOrders.columns.time'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span className={adminTableText.muted}>{formatDateTime(createdAt)}</span>
      ),
    },
  ]

  const topProductColumns = [
    {
      title: translate('admin.dashboard.topProducts.columns.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className={adminTableText.primary}>{name}</span>,
    },
    {
      title: translate('admin.dashboard.topProducts.columns.sold'),
      dataIndex: 'soldCount',
      key: 'soldCount',
      render: (soldCount: number) => (
        <span className={adminTableText.emphasis}>{formatNumber(soldCount)}</span>
      ),
    },
    {
      title: translate('admin.dashboard.topProducts.columns.revenue'),
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => (
        <span className={adminTableText.money}>{formatCurrency(toAdminAmount(revenue))}</span>
      ),
    },
  ]

  return (
    <AdminPage
        eyebrow={translate('admin.dashboard.eyebrow')}
        title={translate('admin.dashboard.title')}
        titleHighlight={translate('admin.dashboard.titleHighlight')}
        description={translate('admin.dashboard.description')}
        actions={
          <>
            <Link to={PATHS.ADMIN_PRODUCTS}>
              <Button variant="outline" size="sm" leftIcon={<Plus className="size-4" />}>
                {translate('admin.dashboard.addProduct')}
              </Button>
            </Link>
            <Link to={PATHS.ADMIN_ANALYTICS}>
              <Button size="sm" rightIcon={<ArrowUpRight className="size-4" />}>
                {translate('admin.dashboard.viewAnalytics')}
              </Button>
            </Link>
          </>
        }
      >

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={translate('admin.dashboard.stats.monthlyRevenue')}
          value={formatCurrency(toAdminAmount(overview.totalRevenue))}
          icon={<DollarSign className="size-5" />}
          tone="fuchsia"
        />
        <StatCard
          label={translate('admin.dashboard.stats.orders')}
          value={formatNumber(overview.totalOrders)}
          icon={<ShoppingCart className="size-5" />}
          tone="cyan"
        />
        <StatCard
          label={translate('admin.dashboard.stats.customers')}
          value={formatNumber(overview.totalCustomers)}
          icon={<Users className="size-5" />}
          tone="indigo"
        />
        <StatCard
          label={translate('admin.dashboard.stats.activeProducts')}
          value={formatNumber(overview.totalProducts)}
          icon={<Package className="size-5" />}
          tone="emerald"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <AdminSection
          className="xl:col-span-8"
          title={translate('admin.dashboard.chart.title')}
          subtitle={translate('admin.dashboard.chart.subtitle')}
        >
          <Column
            data={revenueChartData}
            xField="month"
            yField="value"
            height={280}
            style={{ fill: '#2563eb', radiusTopLeft: 8, radiusTopRight: 8 }}
            axis={{
              x: { labelFill: '#94a3b8', lineStroke: '#334155' },
              y: { labelFill: '#94a3b8', gridStroke: '#1e293b' },
            }}
          />
        </AdminSection>

        <AdminSection className="xl:col-span-4" title={translate('admin.dashboard.ordersByStatus.title')}>
          <ul className="space-y-3">
            {overview.ordersByStatus.map((entry) => (
              <li
                key={entry.status}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="text-sm text-slate-600">
                  {translate(`status.order.${entry.status.toLowerCase()}`)}
                </span>
                <span className="font-bold text-slate-900">{entry.count}</span>
              </li>
            ))}
          </ul>
        </AdminSection>
      </div>

      <AdminSection
        className="mt-6"
        flush
        title={translate('admin.dashboard.recentOrders.title')}
        subtitle={translate('admin.dashboard.recentOrders.subtitle')}
        action={
          <Link to={PATHS.ADMIN_ORDERS}>
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="size-4" />}>
              {translate('admin.dashboard.recentOrders.viewAll')}
            </Button>
          </Link>
        }
      >
        <AdminTable
          rowKey="id"
          columns={recentOrderColumns}
          dataSource={recentOrders}
          loading={recentOrdersQuery.isLoading}
          pagination={false}
          scroll={{ x: 720 }}
        />
      </AdminSection>

      <AdminSection
        className="mt-6"
        flush
        title={translate('admin.dashboard.topProducts.title')}
        subtitle={translate('admin.dashboard.topProducts.subtitle')}
      >
        <AdminTable
          rowKey="productId"
          columns={topProductColumns}
          dataSource={overview.topProducts}
          pagination={false}
          scroll={{ x: 720 }}
        />
      </AdminSection>
    </AdminPage>
  )
}
