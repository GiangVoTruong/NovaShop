import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import VerifyOtpPage from './components/VerifyOtpPage'

export const customerAuthRoutes: RouteObject[] = [
  { path: PATHS.LOGIN, Component: LoginPage },
  { path: PATHS.REGISTER, Component: RegisterPage },
  { path: PATHS.VERIFY_EMAIL, Component: VerifyOtpPage },
]
