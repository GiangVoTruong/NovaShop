import { Boxes } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import { ADMIN_NAV_ITEMS, ADMIN_QUICK_STATS } from '../constants/layout.constants'
import { cx } from '../../../shared/ui/cx'

interface AdminSidebarProps {
  onNavigate?: () => void
  collapsed?: boolean
}

export default function AdminSidebar({
  onNavigate,
  collapsed = false,
}: AdminSidebarProps) {
  const { t } = useTranslation()

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
          <div>
            <p className="text-sm font-extrabold tracking-tight text-white">
              {t('admin.sidebar.brand')}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {t('admin.sidebar.tagline')}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === PATHS.ADMIN}
            onClick={onNavigate}
            title={collapsed ? t(item.labelKey) : undefined}
            className={({ isActive }) =>
              cx(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-linear-to-r from-fuchsia-500/20 to-indigo-500/20 text-white ring-1 ring-fuchsia-400/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <item.icon className="size-[18px] shrink-0" />
            {!collapsed && <span>{t(item.labelKey)}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="space-y-3 border-t border-white/10 px-4 py-4">
          <div className="space-y-2">
            {ADMIN_QUICK_STATS.map((stat) => (
              <div
                key={stat.labelKey}
                className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
              >
                <span className="text-[11px] text-slate-400">{t(stat.labelKey)}</span>
                <span className="text-xs font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-linear-to-br from-fuchsia-500/15 to-indigo-500/15 p-4 ring-1 ring-white/10">
            <p className="text-xs font-bold text-white">{t('admin.sidebar.proTitle')}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              {t('admin.sidebar.proDescription')}
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
