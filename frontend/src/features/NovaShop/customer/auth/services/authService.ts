import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRefreshRequest,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthResendVerificationRequest,
  AuthVerifyEmailRequest,
  ChangePasswordRequest,
  UpdateUserProfileRequest,
  UserProfile,
} from '@/types/auth.types'
import type { ApiResponse } from '@/types/api.types'

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

  updateMe: async (request: UpdateUserProfileRequest): Promise<UserProfile> => {
    const { data } = await axiosInstance.put<ApiResponse<UserProfile>>('/users/me', request)
    return requireApiData(data, 'Failed to update profile')
  },

  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.post('/auth/change-password', request)
  },
}

export default authService
