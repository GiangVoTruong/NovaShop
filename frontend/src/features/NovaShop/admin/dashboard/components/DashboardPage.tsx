import { Line } from '@ant-design/charts'
import { ArrowUpRight, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import { ANALYTICS } from '@/features/NovaShop/shared/data/analytics'
import { ORDERS } from '@/features/NovaShop/shared/data/orders'
import { formatCurrency, formatDateTime } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import { OrderStatusBadge } from '@/features/NovaShop/shared/ui/StatusBadge'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
import AdminSection from '../../layout/components/AdminSection'
import AdminShell from '../../layout/components/AdminShell'
import AdminTable from '../../layout/components/AdminTable'
import StatCard from '../../layout/components/StatCard'
import { adminTableAvatar, adminTableText } from '../../layout/constants/adminTableStyles'
import { DASHBOARD_ACTIVITY, DASHBOARD_STATS } from '../constants/dashboard.constants'
import type { Order } from '@/features/NovaShop/shared/types'

const ACTIVITY_DOT_COLORS = ['bg-fuchsia-400', 'bg-amber-400', 'bg-cyan-400', 'bg-indigo-400']

export default function DashboardPage() {
  const { t: translate } = useTranslation()
  const chartData = ANALYTICS.slice(-6).flatMap((point) => [
    {
      month: point.month,
      value: point.revenue / 1_000_000,
      type: translate('admin.dashboard.chart.revenueSeries'),
    },
    {
      month: point.month,
      value: point.orders,
      type: translate('admin.dashboard.chart.ordersSeries'),
    },
  ])

  const recentOrderColumns = [
    {
      title: translate('admin.dashboard.recentOrders.columns.code'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <span className={adminTableText.code}>{code}</span>,
    },
    {
      title: translate('admin.dashboard.recentOrders.columns.customer'),
      key: 'customer',
      render: (_: unknown, order: Order) => (
        <div className="flex items-center gap-2.5">
          <img src={order.customerAvatar} alt={order.customerName} className={adminTableAvatar} />
          <span className={adminTableText.primary}>{order.customerName}</span>
        </div>
      ),
    },
    {
      title: translate('admin.dashboard.recentOrders.columns.total'),
      key: 'total',
      render: (_: unknown, order: Order) => (
        <span className={adminTableText.money}>{formatCurrency(order.total)}</span>
      ),
    },
    {
      title: translate('admin.dashboard.recentOrders.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => <OrderStatusBadge status={status} />,
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

  return (
    <AdminShell>
      <AdminPageHeader
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
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.labelKey}
            label={translate(stat.labelKey)}
            value={stat.value}
            change={
              'changeKey' in stat ? translate(stat.changeKey, stat.changeParams) : stat.change
            }
            icon={<stat.icon className="size-5" />}
            tone={stat.tone}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <AdminSection
          className="xl:col-span-8"
          title={translate('admin.dashboard.chart.title')}
          subtitle={translate('admin.dashboard.chart.subtitle')}
        >
          <Line
            data={chartData}
            xField="month"
            yField="value"
            colorField="type"
            height={280}
            smooth
            axis={{
              x: { labelFill: '#94a3b8', lineStroke: '#334155' },
              y: { labelFill: '#94a3b8', gridStroke: '#1e293b' },
            }}
            legend={{ color: { itemLabelFill: '#cbd5e1' } }}
          />
        </AdminSection>

        <AdminSection className="xl:col-span-4" title={translate('admin.dashboard.activity.title')}>
          <ul className="space-y-3">
            {DASHBOARD_ACTIVITY.map((activity, index) => (
              <li
                key={activity.id}
                className="flex gap-3 rounded-xl px-1 py-1 transition hover:bg-white/5"
              >
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${ACTIVITY_DOT_COLORS[index % ACTIVITY_DOT_COLORS.length]}`}
                />
                <div>
                  <p className="text-sm text-slate-200">
                    {'textParams' in activity && activity.textParams
                      ? translate(activity.textKey, activity.textParams)
                      : translate(activity.textKey)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {'timeParams' in activity && activity.timeParams
                      ? translate(activity.timeKey, activity.timeParams)
                      : translate(activity.timeKey)}
                  </p>
                </div>
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
          dataSource={ORDERS.slice(0, 5)}
          pagination={false}
          scroll={{ x: 720 }}
        />
      </AdminSection>
    </AdminShell>
  )
}
