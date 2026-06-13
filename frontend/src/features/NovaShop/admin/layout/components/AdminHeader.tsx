import { Menu, PanelLeft, PanelLeftClose, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import LanguageSwitcher from '@/lib/i18n/LanguageSwitcher'
import NotificationBell from '@/features/NovaShop/shared/notifications/components/NotificationBell'
import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { BUTTON_SIZE_CLASS, BUTTON_VARIANT_CLASS } from '../../../shared/ui/button.constants'
import { cx } from '../../../shared/ui/cx'
import AdminGlobalSearch from './AdminGlobalSearch'

interface AdminHeaderProps {
  onMenuClick: () => void
  sidebarCollapsed: boolean
  onToggleCollapse: () => void
}

export default function AdminHeader({
  onMenuClick,
  sidebarCollapsed,
  onToggleCollapse,
}: AdminHeaderProps) {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const CollapseIcon = sidebarCollapsed ? PanelLeft : PanelLeftClose

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
        aria-label={t('admin.header.openMenu')}
      >
        <Menu className="size-5" />
      </button>

      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:flex"
        aria-label={
          sidebarCollapsed
            ? t('admin.header.expandSidebar')
            : t('admin.header.collapseSidebar')
        }
      >
        <CollapseIcon className="size-5" />
      </button>

      <AdminGlobalSearch />

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link
          to={PATHS.HOME}
          className={cx(
            'hidden sm:inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl font-semibold tracking-tight transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 focus-visible:ring-offset-2',
            BUTTON_VARIANT_CLASS.ghost,
            BUTTON_SIZE_CLASS.sm,
          )}
        >
          <Store className="size-4" />
          {t('admin.header.viewStore')}
        </Link>

        <LanguageSwitcher className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" />

        {isAuthenticated ? <NotificationBell orderLinkMode="admin" /> : null}

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-3">
          <img
            src="https://i.pravatar.cc/80?img=12"
            alt={t('admin.header.userName')}
            className="size-8 rounded-xl object-cover"
          />
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900">{t('admin.header.userName')}</p>
            <p className="text-[10px] text-slate-400">{t('admin.header.userRole')}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
