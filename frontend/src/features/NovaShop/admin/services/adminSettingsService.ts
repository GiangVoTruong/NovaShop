import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { ShopSettings } from '@/types/admin.types'
import type { ApiResponse } from '@/types/api.types'

const adminSettingsService = {
  getSettings: async (): Promise<ShopSettings> => {
    const { data } = await axiosInstance.get<ApiResponse<ShopSettings>>('/admin/settings')
    return requireApiData(data, 'Failed to load settings')
  },

  updateSettings: async (settings: ShopSettings): Promise<ShopSettings> => {
    const { data } = await axiosInstance.put<ApiResponse<ShopSettings>>('/admin/settings', settings)
    return requireApiData(data, 'Failed to update settings')
  },
}

export default adminSettingsService
