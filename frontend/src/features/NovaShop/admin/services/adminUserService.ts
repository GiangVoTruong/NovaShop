import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { AdminUser } from '@/types/admin.types'
import type { ApiResponse } from '@/types/product.types'

const adminUserService = {
  getAll: async (): Promise<AdminUser[]> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminUser[]>>('/users')
    return requireApiData(data, 'Failed to load users') ?? []
  },
}

export default adminUserService
