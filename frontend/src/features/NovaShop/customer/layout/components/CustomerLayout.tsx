import { CategorySlugProvider } from '@/features/NovaShop/customer/catalog/context/CategorySlugProvider'
import { Outlet } from 'react-router-dom'
import CustomerBottomNav from './CustomerBottomNav'
import CustomerFooter from './CustomerFooter'
import CustomerHeader from './CustomerHeader'

export default function CustomerLayout() {
  return (
    <CategorySlugProvider>
    <div className="customer-shell relative flex min-h-screen flex-col overflow-x-clip pb-24 lg:pb-0">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="blob left-[-12%] top-[-8%] size-[420px] bg-fuchsia-400/18" />
        <div className="blob right-[-10%] top-[18%] size-[460px] bg-cyan-400/12" />
        <div className="blob bottom-[8%] left-[35%] size-[400px] bg-violet-400/15" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <CustomerHeader />
      <main className="relative z-0 min-w-0 flex-1">
        <Outlet />
      </main>
      <CustomerFooter />
      <CustomerBottomNav />
    </div>
    </CategorySlugProvider>
  )
}
