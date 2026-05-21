import { axiosInstance } from '@/lib/axios/instances'
import type { AuthRegisterRequest } from '@/types/auth.types'

export async function register(request: AuthRegisterRequest): Promise<void> {
  await axiosInstance.post('/users', request)
}
