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

const authService = {
  login: async (request: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const url = '/auth/login'
    const { data } = await axiosInstance.post<AuthLoginResponse>(url, request)
    return data
  },

  refresh: async (request: AuthRefreshRequest): Promise<AuthLoginResponse> => {
    const { data } = await axiosInstance.post<AuthLoginResponse>('/auth/refresh', request)
    return data
  },

  getMe: async (): Promise<UserProfile> => {
    const { data } = await axiosInstance.get<UserProfile>('/users/me')
    return data
  },

  register: async (request: AuthRegisterRequest): Promise<AuthRegisterResponse> => {
    const url = '/auth/register'
    const { data } = await axiosInstance.post<AuthRegisterResponse>(url, request)
    return data
  },

  verifyEmail: async (request: AuthVerifyEmailRequest): Promise<AuthLoginResponse> => {
    const url = '/auth/verify-email'
    const { data } = await axiosInstance.post<AuthLoginResponse>(url, request)
    return data
  },

  resendVerification: async (request: AuthResendVerificationRequest): Promise<void> => {
    const url = '/auth/resend-verification'
    await axiosInstance.post(url, request)
  },
}

export default authService
