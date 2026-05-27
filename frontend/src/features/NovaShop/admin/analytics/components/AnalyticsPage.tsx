import { Column, Line } from '@ant-design/charts'
import { DollarSign, Eye, ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ANALYTICS } from '@/features/NovaShop/shared/data/analytics'
import { formatCurrency, formatNumber } from '@/features/NovaShop/shared/format'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
import AdminSection from '../../layout/components/AdminSection'
import AdminShell from '../../layout/components/AdminShell'
import StatCard from '../../layout/components/StatCard'

const latest = ANALYTICS[ANALYTICS.length - 1]
const previous = ANALYTICS[ANALYTICS.length - 2]

const revenueChange = (
  ((latest.revenue - previous.revenue) / previous.revenue) *
  100
).toFixed(1)
const ordersChange = (
  ((latest.orders - previous.orders) / previous.orders) *
  100
).toFixed(1)
const visitorsChange = (
  ((latest.visitors - previous.visitors) / previous.visitors) *
  100
).toFixed(1)

export default function AnalyticsPage() {
  const { t: translate } = useTranslation()

  const revenueData = ANALYTICS.map((point) => ({
    month: point.month,
    value: point.revenue / 1_000_000,
  }))

  const visitorsChartData = ANALYTICS.flatMap((point) => [
    {
      month: point.month,
      value: point.visitors,
      type: translate('admin.analytics.visitorsChart.visitors'),
    },
    {
      month: point.month,
      value: point.orders * 50,
      type: translate('admin.analytics.visitorsChart.ordersScaled'),
    },
  ])

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow={translate('admin.analytics.eyebrow')}
        title={translate('admin.analytics.title')}
        titleHighlight={translate('admin.analytics.titleHighlight')}
        description={translate('admin.analytics.description')}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={translate('admin.analytics.stats.monthlyRevenue')}
          value={formatCurrency(latest.revenue)}
          change={`+${revenueChange}%`}
          icon={<DollarSign className="size-5" />}
          tone="fuchsia"
        />
        <StatCard
          label={translate('admin.analytics.stats.orders')}
          value={formatNumber(latest.orders)}
          change={`+${ordersChange}%`}
          icon={<ShoppingCart className="size-5" />}
          tone="cyan"
        />
        <StatCard
          label={translate('admin.analytics.stats.visitors')}
          value={formatNumber(latest.visitors)}
          change={`+${visitorsChange}%`}
          icon={<Eye className="size-5" />}
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
            style={{ fill: '#d946ef', radiusTopLeft: 8, radiusTopRight: 8 }}
            axis={{
              x: { labelFill: '#94a3b8', lineStroke: '#334155' },
              y: { labelFill: '#94a3b8', gridStroke: '#1e293b' },
            }}
          />
        </AdminSection>

        <AdminSection
          title={translate('admin.analytics.visitorsChart.title')}
          subtitle={translate('admin.analytics.visitorsChart.subtitle')}
        >
          <Line
            data={visitorsChartData}
            xField="month"
            yField="value"
            colorField="type"
            height={300}
            smooth
            axis={{
              x: { labelFill: '#94a3b8', lineStroke: '#334155' },
              y: { labelFill: '#94a3b8', gridStroke: '#1e293b' },
            }}
            legend={{ color: { itemLabelFill: '#cbd5e1' } }}
          />
        </AdminSection>
      </div>
    </AdminShell>
  )
}
