import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

export default function RootLayout() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Đang tải…</div>}>
      <ScrollToTop />
      <Outlet />
    </Suspense>
  )
}
