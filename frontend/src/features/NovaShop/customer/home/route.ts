import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import HomePage from './components/HomePage'

export const customerHomeRoutes: RouteObject[] = [
  { path: PATHS.HOME, Component: HomePage },
]
