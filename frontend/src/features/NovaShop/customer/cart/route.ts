import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import RequireAuth from '@/features/NovaShop/customer/auth/components/RequireAuth'
import CartPage from './components/CartPage'

export const customerCartRoutes: RouteObject[] = [
  {
    path: PATHS.CART,
    element: createElement(RequireAuth, null, createElement(CartPage)),
  },
]
