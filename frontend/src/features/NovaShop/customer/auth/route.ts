import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'

export const customerAuthRoutes: RouteObject[] = [
  { path: PATHS.LOGIN, Component: LoginPage },
  { path: PATHS.REGISTER, Component: RegisterPage },
]
