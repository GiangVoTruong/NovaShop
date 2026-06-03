import { useState } from 'react'
import { ConfigProvider, Drawer } from 'antd'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { adminAntdTheme } from '@/lib/antd/adminTheme'
import { getAntdLocale } from '@/lib/i18n/antdLocale'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const { i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <ConfigProvider locale={getAntdLocale(i18n.language)} theme={adminAntdTheme}>
      <div className="admin-app flex min-h-screen bg-slate-100 text-slate-900">
        <aside
          className={cx(
            'fixed inset-y-0 left-0 z-40 hidden lg:block',
            sidebarCollapsed ? 'w-[72px]' : 'w-64',
          )}
        >
          <AdminSidebar collapsed={sidebarCollapsed} />
        </aside>

        <Drawer
          placement="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          size={280}
          styles={{
            body: { padding: 0, background: '#ffffff' },
            header: { display: 'none' },
          }}
        >
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </Drawer>

        <div
          className={cx(
            'flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-300',
            sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64',
          )}
        >
          <AdminHeader
            onMenuClick={() => setMobileOpen(true)}
            sidebarCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
          />

          <main className="relative flex-1 overflow-x-hidden bg-slate-100 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            <Outlet />
          </main>
        </div>
      </div>
    </ConfigProvider>
  )
}
