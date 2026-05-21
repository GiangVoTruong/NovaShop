import { Column, Line } from '@ant-design/charts'
import { DollarSign, Eye, ShoppingCart } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ANALYTICS } from '../../../shared/data/analytics'
import { formatCurrency, formatNumber } from '../../../shared/format'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
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
  const { t } = useTranslation()

  const revenueData = ANALYTICS.map((point) => ({
    month: point.month,
    value: point.revenue / 1_000_000,
  }))

  const visitorsChartData = useMemo(
    () =>
      ANALYTICS.flatMap((point) => [
        {
          month: point.month,
          value: point.visitors,
          type: t('admin.analytics.visitorsChart.visitors'),
        },
        {
          month: point.month,
          value: point.orders * 50,
          type: t('admin.analytics.visitorsChart.ordersScaled'),
        },
      ]),
    [t],
  )

  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow={t('admin.analytics.eyebrow')}
        title={
          <>
            {t('admin.analytics.title')}{' '}
            <span className="text-gradient">{t('admin.analytics.titleHighlight')}</span>
          </>
        }
        description={t('admin.analytics.description')}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t('admin.analytics.stats.monthlyRevenue')}
          value={formatCurrency(latest.revenue)}
          change={`+${revenueChange}%`}
          icon={<DollarSign className="size-5" />}
          tone="fuchsia"
        />
        <StatCard
          label={t('admin.analytics.stats.orders')}
          value={formatNumber(latest.orders)}
          change={`+${ordersChange}%`}
          icon={<ShoppingCart className="size-5" />}
          tone="cyan"
        />
        <StatCard
          label={t('admin.analytics.stats.visitors')}
          value={formatNumber(latest.visitors)}
          change={`+${visitorsChange}%`}
          icon={<Eye className="size-5" />}
          tone="indigo"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="glass-dark rounded-3xl p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-bold text-white">
            {t('admin.analytics.revenueChart.title')}
          </h2>
          <p className="mb-4 text-sm text-slate-400">
            {t('admin.analytics.revenueChart.unit')}
          </p>
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
        </section>

        <section className="glass-dark rounded-3xl p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-bold text-white">
            {t('admin.analytics.visitorsChart.title')}
          </h2>
          <p className="mb-4 text-sm text-slate-400">
            {t('admin.analytics.visitorsChart.subtitle')}
          </p>
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
        </section>
      </div>
    </div>
  )
}
