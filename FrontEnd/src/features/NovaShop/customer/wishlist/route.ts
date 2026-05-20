import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import WishlistPage from './components/WishlistPage'

export const customerWishlistRoutes: RouteObject[] = [
  { path: PATHS.WISHLIST, Component: WishlistPage },
]
