import { Boxes, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import { formatCurrency, formatNumber } from '@/features/NovaShop/shared/format'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { useAdminAnalyticsSummary } from '../../hooks/useAdminAnalytics'
import { ADMIN_NAV_SECTIONS } from '../constants/layout.constants'

interface AdminSidebarProps {
  onNavigate?: () => void
  collapsed?: boolean
}

const QUICK_STAT_TONE_CLASS = {
  amber: 'text-amber-600',
  rose: 'text-rose-600',
  emerald: 'text-emerald-600',
} as const

export default function AdminSidebar({
  onNavigate,
  collapsed = false,
}: AdminSidebarProps) {
  const { t: translate } = useTranslation()
  const summaryQuery = useAdminAnalyticsSummary()
  const summary = summaryQuery.data

  const quickStats = [
    {
      labelKey: 'admin.quickStats.pendingOrders',
      value: formatNumber(summary?.pendingOrders ?? 0),
      tone: 'amber' as const,
    },
    {
      labelKey: 'admin.quickStats.lowStock',
      value: formatNumber(summary?.lowStockProducts ?? 0),
      tone: 'rose' as const,
    },
    {
      labelKey: 'admin.quickStats.todayRevenue',
      value: formatCurrency(summary?.todayRevenue ?? 0),
      tone: 'emerald' as const,
    },
  ]

  return (
    <aside
      className={cx(
        'flex h-full flex-col border-r border-slate-200 bg-white',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div
        className={cx(
          'flex items-center gap-3 border-b border-slate-200 px-4 py-5',
          collapsed && 'justify-center px-2',
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
          <Boxes className="size-5 text-blue-600" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-slate-900">
              {translate('admin.sidebar.brand')}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {translate('admin.sidebar.tagline')}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3 no-scrollbar">
        {ADMIN_NAV_SECTIONS.map((section) => (
          <div key={section.labelKey}>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500/90">
                {translate(section.labelKey)}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === PATHS.ADMIN}
                  onClick={onNavigate}
                  title={collapsed ? translate(item.labelKey) : undefined}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                    )
                  }
                >
                  <item.icon className="size-[18px] shrink-0" />
                  {!collapsed && <span>{translate(item.labelKey)}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="space-y-3 border-t border-slate-200 px-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            {quickStats.map((stat) => (
              <div
                key={stat.labelKey}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center"
              >
                <p
                  className={cx(
                    'text-sm font-bold',
                    QUICK_STAT_TONE_CLASS[stat.tone],
                  )}
                >
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[9px] leading-tight text-slate-500/90">
                  {translate(stat.labelKey)}
                </p>
              </div>
            ))}
          </div>
          <Link
            to={PATHS.HOME}
            onClick={onNavigate}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <span>{translate('admin.sidebar.viewStore')}</span>
            <ExternalLink className="size-3.5 opacity-70" />
          </Link>
        </div>
      )}
    </aside>
  )
}
