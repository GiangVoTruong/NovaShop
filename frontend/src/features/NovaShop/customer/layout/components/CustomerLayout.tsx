import { Outlet } from 'react-router-dom'
import { ShopProvider } from '../../../shared/store/ShopStore'
import CustomerBottomNav from './CustomerBottomNav'
import CustomerFooter from './CustomerFooter'
import CustomerHeader from './CustomerHeader'

export default function CustomerLayout() {
  return (
    <ShopProvider>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-white pb-24 lg:pb-0">
        {/* Decorative ambient background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="blob animate-float-slow left-[-10%] top-[-5%] size-[480px] bg-fuchsia-300/40" />
          <div className="blob animate-float-slower right-[-15%] top-[20%] size-[520px] bg-cyan-300/35" />
          <div className="blob animate-float-slow bottom-[10%] left-[30%] size-[460px] bg-purple-300/35" />
        </div>

        <CustomerHeader />
        <main className="relative z-0 flex-1">
          <Outlet />
        </main>
        <CustomerFooter />
        <CustomerBottomNav />
      </div>
    </ShopProvider>
  )
}
