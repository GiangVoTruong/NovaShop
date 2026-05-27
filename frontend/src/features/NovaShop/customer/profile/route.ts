import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import RequireAuth from '@/features/NovaShop/customer/auth/components/RequireAuth'
import ProfilePage from './components/ProfilePage'

export const customerProfileRoutes: RouteObject[] = [
  {
    path: PATHS.PROFILE,
    element: createElement(RequireAuth, null, createElement(ProfilePage)),
  },
]
