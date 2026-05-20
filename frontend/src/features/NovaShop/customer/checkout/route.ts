import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import CheckoutPage from './components/CheckoutPage'

export const customerCheckoutRoutes: RouteObject[] = [
  { path: PATHS.CHECKOUT, Component: CheckoutPage },
]
