import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import RequireAuth from '@/features/NovaShop/customer/auth/components/RequireAuth'
import OrdersPage from './components/OrdersPage'

export const customerOrderRoutes: RouteObject[] = [
  {
    path: PATHS.ORDERS,
    element: createElement(RequireAuth, null, createElement(OrdersPage)),
  },
]
