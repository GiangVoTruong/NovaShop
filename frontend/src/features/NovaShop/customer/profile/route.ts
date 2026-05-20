import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import ProfilePage from './components/ProfilePage'

export const customerProfileRoutes: RouteObject[] = [
  { path: PATHS.PROFILE, Component: ProfilePage },
]
