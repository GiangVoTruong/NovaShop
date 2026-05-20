import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import CartPage from './components/CartPage'

export const customerCartRoutes: RouteObject[] = [
  { path: PATHS.CART, Component: CartPage },
]
