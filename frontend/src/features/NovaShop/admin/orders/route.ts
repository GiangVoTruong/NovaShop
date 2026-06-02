import { PATHS } from '@/router/paths'
import AdminOrderDetailPage from './components/AdminOrderDetailPage'
import AdminOrdersPage from './components/AdminOrdersPage'

export const adminOrderRoutes = [
  { path: PATHS.ADMIN_ORDERS, Component: AdminOrdersPage },
  { path: PATHS.ADMIN_ORDER_DETAIL, Component: AdminOrderDetailPage },
]
