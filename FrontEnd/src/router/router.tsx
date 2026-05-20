import { createBrowserRouter } from 'react-router-dom'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import NotFound from '@/components/layout/NotFound'
import RootLayout from '@/components/layout/RootLayout'
import { novaShopRoutes } from '@/features/NovaShop/router'

/**
 * Router trung tâm — gom route từ các feature.
 * Mỗi feature export `RouteObject[]` ở `features/<name>/router.tsx`.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [...novaShopRoutes, { path: '*', element: <NotFound /> }],
  },
])
