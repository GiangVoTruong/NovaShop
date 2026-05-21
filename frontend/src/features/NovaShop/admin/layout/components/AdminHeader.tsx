import { Bell, Menu, Search, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import Button from '../../../shared/ui/Button'

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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 lg:hidden"
        aria-label={t('admin.header.openMenu')}
      >
        <Menu className="size-5" />
      </button>

      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden size-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 lg:flex"
        aria-label={
          sidebarCollapsed
            ? t('admin.header.expandSidebar')
            : t('admin.header.collapseSidebar')
        }
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden min-w-0 flex-1 sm:block">
        <div className="flex max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3">
          <Search className="size-4 shrink-0 text-slate-400" />
          <input
            type="search"
            placeholder={t('admin.header.searchPlaceholder')}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link to={PATHS.HOME} className="hidden sm:block">
          <Button variant="ghost" size="sm" leftIcon={<Store className="size-4" />}>
            {t('admin.header.viewStore')}
          </Button>
        </Link>

        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10"
          aria-label={t('admin.header.notifications')}
        >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-fuchsia-500 ring-2 ring-slate-950" />
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3">
          <img
            src="https://i.pravatar.cc/80?img=12"
            alt={t('admin.header.userName')}
            className="size-8 rounded-xl object-cover"
          />
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white">{t('admin.header.userName')}</p>
            <p className="text-[10px] text-slate-400">{t('admin.header.userRole')}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
