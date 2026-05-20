import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import OrdersPage from './components/OrdersPage'

export const customerOrderRoutes: RouteObject[] = [
  { path: PATHS.ORDERS, Component: OrdersPage },
]
