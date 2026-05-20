import { Boxes } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import { ADMIN_NAV_ITEMS } from '../constants/layout.constants'
import { cx } from '../../../shared/ui/cx'

interface AdminSidebarProps {
  onNavigate?: () => void
  collapsed?: boolean
}

export default function AdminSidebar({
  onNavigate,
  collapsed = false,
}: AdminSidebarProps) {
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
              Nova<span className="text-gradient">Admin</span>
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Control panel
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
            title={collapsed ? item.label : undefined}
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
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-linear-to-br from-fuchsia-500/15 to-indigo-500/15 p-4 ring-1 ring-white/10">
            <p className="text-xs font-bold text-white">NovaShop Pro</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Gói doanh nghiệp — không giới hạn sản phẩm & báo cáo nâng cao.
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
