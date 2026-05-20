import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Đang tải…</div>}>
      <Outlet />
    </Suspense>
  )
}
