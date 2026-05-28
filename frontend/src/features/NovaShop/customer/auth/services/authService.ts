import { axiosInstance } from '@/lib/axios/instances'
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRefreshRequest,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthResendVerificationRequest,
  AuthVerifyEmailRequest,
  UserProfile,
} from '@/types/auth.types'
import type { ApiResponse } from '@/types/product.types'

function requireApiData<T>(body: ApiResponse<T>, fallbackMessage: string): T {
  if (!body.success || body.data == null) {
    throw new Error(body.message || fallbackMessage)
  }
  return body.data
}

const authService = {
  login: async (request: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<AuthLoginResponse>>(
      '/auth/login',
      request,
    )
    return requireApiData(data, 'Login failed')
  },

  refresh: async (request: AuthRefreshRequest): Promise<AuthLoginResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<AuthLoginResponse>>(
      '/auth/refresh',
      request,
    )
    return requireApiData(data, 'Token refresh failed')
  },

  getMe: async (): Promise<UserProfile> => {
    const { data } = await axiosInstance.get<ApiResponse<UserProfile>>('/users/me')
    return requireApiData(data, 'Failed to load profile')
  },

  register: async (request: AuthRegisterRequest): Promise<AuthRegisterResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<AuthRegisterResponse>>(
      '/auth/register',
      request,
    )
    return requireApiData(data, 'Registration failed')
  },

  verifyEmail: async (request: AuthVerifyEmailRequest): Promise<AuthLoginResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<AuthLoginResponse>>(
      '/auth/verify-email',
      request,
    )
    return requireApiData(data, 'Email verification failed')
  },

  resendVerification: async (request: AuthResendVerificationRequest): Promise<void> => {
    await axiosInstance.post('/auth/resend-verification', request)
  },
}

export default authService
