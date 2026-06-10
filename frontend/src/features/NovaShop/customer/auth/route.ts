import { PATHS } from '@/router/paths'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import VerifyOtpPage from './components/VerifyOtpPage'
import type { RouteObject } from 'react-router-dom'

export const customerAuthRoutes: RouteObject[] = [
  { path: PATHS.LOGIN, Component: LoginPage },
  { path: PATHS.REGISTER, Component: RegisterPage },
  { path: PATHS.VERIFY_EMAIL, Component: VerifyOtpPage },
  { path: PATHS.FORGOT_PASSWORD, Component: ForgotPasswordPage },
  { path: PATHS.RESET_PASSWORD, Component: ResetPasswordPage },
]
