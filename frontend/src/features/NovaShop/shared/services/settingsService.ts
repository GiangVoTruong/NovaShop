import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { PublicShopSettings } from '@/types/settings.types'
import type { ApiResponse } from '@/types/api.types'

const settingsService = {
  getPublicSettings: async (): Promise<PublicShopSettings> => {
    const { data } = await axiosInstance.get<ApiResponse<PublicShopSettings>>('/settings/public')
    return requireApiData(data, 'Failed to load shop settings')
  },
}

export default settingsService
