import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import RequireAuth from '@/features/NovaShop/customer/auth/components/RequireAuth'
import { PATHS } from '@/router/paths'
import WishlistPage from './components/WishlistPage'

export const customerWishlistRoutes: RouteObject[] = [
  {
    path: PATHS.WISHLIST,
    element: createElement(RequireAuth, null, createElement(WishlistPage)),
  },
]
