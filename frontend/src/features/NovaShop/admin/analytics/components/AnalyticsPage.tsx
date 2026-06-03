import { Column, Pie } from '@ant-design/charts'
import { DollarSign, Package, ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Spin } from 'antd'
import { formatCurrency, formatNumber } from '@/features/NovaShop/shared/format'
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics'
import { toAdminAmount } from '../../lib/adminApi'
import AdminPage from '../../layout/components/AdminPage'
import AdminSection from '../../layout/components/AdminSection'
import StatCard from '../../layout/components/StatCard'

export default function AnalyticsPage() {
  const { t: translate } = useTranslation()
  const analyticsQuery = useAdminAnalytics()
  const overview = analyticsQuery.data

  if (analyticsQuery.isLoading || !overview) {
    return (
      <AdminShell className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </AdminShell>
    )
  }

  const revenueData = overview.revenueByMonth.map((point) => ({
    month: point.month,
    value: toAdminAmount(point.revenue) / 1_000_000,
  }))

  const ordersByStatusData = overview.ordersByStatus.map((entry) => ({
    status: translate(`status.order.${entry.status.toLowerCase()}`),
    count: entry.count,
  }))

  return (
    <AdminPage
      eyebrow={translate('admin.analytics.eyebrow')}
      title={translate('admin.analytics.title')}
      titleHighlight={translate('admin.analytics.titleHighlight')}
      description={translate('admin.analytics.description')}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={translate('admin.analytics.stats.totalRevenue')}
          value={formatCurrency(toAdminAmount(overview.totalRevenue))}
          icon={<DollarSign className="size-5" />}
          tone="indigo"
        />
        <StatCard
          label={translate('admin.analytics.stats.orders')}
          value={formatNumber(overview.totalOrders)}
          icon={<ShoppingCart className="size-5" />}
          tone="cyan"
        />
        <StatCard
          label={translate('admin.analytics.stats.products')}
          value={formatNumber(overview.totalProducts)}
          icon={<Package className="size-5" />}
          tone="indigo"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <AdminSection
          title={translate('admin.analytics.revenueChart.title')}
          subtitle={translate('admin.analytics.revenueChart.unit')}
        >
          <Column
            data={revenueData}
            xField="month"
            yField="value"
            height={300}
            style={{ fill: '#2563eb', radiusTopLeft: 8, radiusTopRight: 8 }}
            axis={{
              x: { labelFill: '#94a3b8', lineStroke: '#334155' },
              y: { labelFill: '#94a3b8', gridStroke: '#1e293b' },
            }}
          />
        </AdminSection>

        <AdminSection title={translate('admin.analytics.ordersByStatus.title')}>
          <Pie
            data={ordersByStatusData}
            angleField="count"
            colorField="status"
            height={300}
            legend={{ color: { itemLabelFill: '#cbd5e1' } }}
          />
        </AdminSection>
      </div>
    </AdminPage>
  )
}
