import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import RequireAuth from '@/features/NovaShop/customer/auth/components/RequireAuth'
import CheckoutPage from './components/CheckoutPage'

export const customerCheckoutRoutes: RouteObject[] = [
  {
    path: PATHS.CHECKOUT,
    element: createElement(RequireAuth, null, createElement(CheckoutPage)),
  },
]
