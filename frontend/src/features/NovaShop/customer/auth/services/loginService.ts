import { axiosInstance } from '@/lib/axios/instances'
import type { AuthLoginRequest, AuthLoginResponse } from '@/types/auth.types'

export async function login(request: AuthLoginRequest): Promise<AuthLoginResponse> {
  const { data } = await axiosInstance.post<AuthLoginResponse>('/auth/login', request)
  return data
}
