import { Boxes, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { ADMIN_NAV_SECTIONS, ADMIN_QUICK_STATS } from '../constants/layout.constants'

interface AdminSidebarProps {
  onNavigate?: () => void
  collapsed?: boolean
}

const QUICK_STAT_TONE_CLASS = {
  amber: 'text-amber-300',
  rose: 'text-rose-300',
  emerald: 'text-emerald-300',
} as const

export default function AdminSidebar({
  onNavigate,
  collapsed = false,
}: AdminSidebarProps) {
  const { t: translate } = useTranslation()

  return (
    <aside
      className={cx(
        'flex h-full flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-xl',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div
        className={cx(
          'flex items-center gap-3 border-b border-white/10 px-4 py-5',
          collapsed && 'justify-center px-2',
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-indigo-600 shadow-lg shadow-fuchsia-500/30">
          <Boxes className="size-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold tracking-tight text-white">
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
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
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
                      'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-linear-to-r from-fuchsia-500/25 to-indigo-500/25 text-white shadow-sm shadow-fuchsia-500/10 ring-1 ring-fuchsia-400/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white',
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
        <div className="space-y-3 border-t border-white/10 px-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            {ADMIN_QUICK_STATS.map((stat) => (
              <div
                key={stat.labelKey}
                className="rounded-xl bg-white/5 px-2 py-2 text-center ring-1 ring-white/5"
              >
                <p
                  className={cx(
                    'text-sm font-bold',
                    QUICK_STAT_TONE_CLASS[stat.tone],
                  )}
                >
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[9px] leading-tight text-slate-500">
                  {translate(stat.labelKey)}
                </p>
              </div>
            ))}
          </div>
          <Link
            to={PATHS.HOME}
            onClick={onNavigate}
            className="flex items-center justify-between rounded-2xl bg-linear-to-r from-fuchsia-500/10 to-indigo-500/10 px-3 py-2.5 text-sm font-semibold text-fuchsia-200 ring-1 ring-white/10 transition hover:from-fuchsia-500/15 hover:to-indigo-500/15"
          >
            <span>{translate('admin.sidebar.viewStore')}</span>
            <ExternalLink className="size-3.5 opacity-70" />
          </Link>
        </div>
      )}
    </aside>
  )
}
