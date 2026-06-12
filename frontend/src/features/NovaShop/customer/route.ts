import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import CustomerLayout from './layout/components/CustomerLayout'
import { customerAuthRoutes } from './auth/route'
import { customerCartRoutes } from './cart/route'
import { customerCheckoutRoutes } from './checkout/route'
import { customerContentRoutes } from './content/route'
import { customerHomeRoutes } from './home/route'
import { customerOrderRoutes } from './orders/route'
import { customerProductRoutes } from './product/route'
import { customerProfileRoutes } from './profile/route'
import { customerWishlistRoutes } from './wishlist/route'

export const customerRoutes: RouteObject[] = [
  {
    element: createElement(CustomerLayout),
    children: [
      ...customerHomeRoutes,
      ...customerContentRoutes,
      ...customerProductRoutes,
      ...customerCartRoutes,
      ...customerCheckoutRoutes,
      ...customerWishlistRoutes,
      ...customerOrderRoutes,
      ...customerProfileRoutes,
    ],
  },
  ...customerAuthRoutes,
]
