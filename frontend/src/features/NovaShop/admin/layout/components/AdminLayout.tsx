import { useState } from 'react'
import { ConfigProvider, Drawer } from 'antd'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShopProvider } from '@/features/NovaShop/shared/store/ShopStore'
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
      <ShopProvider>
        <div className="mesh-bg-dark flex min-h-screen">
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
              body: { padding: 0, background: '#020617' },
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

            <main className="relative flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="blob animate-float-slow left-[-5%] top-[5%] size-[360px] bg-fuchsia-500/20" />
                <div className="blob animate-float-slower right-[-8%] top-[30%] size-[420px] bg-cyan-400/15" />
              </div>
              <Outlet />
            </main>
          </div>
        </div>
      </ShopProvider>
    </ConfigProvider>
  )
}
