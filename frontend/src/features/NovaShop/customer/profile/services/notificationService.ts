import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { NotificationPreferences } from '@/types/notification.types'
import type { ApiResponse } from '@/types/product.types'

const notificationService = {
  getPreferences: async (): Promise<NotificationPreferences> => {
    const { data } = await axiosInstance.get<ApiResponse<NotificationPreferences>>(
      '/users/me/notifications/preferences',
    )
    return requireApiData(data, 'Failed to load notification preferences')
  },

  updatePreferences: async (
    preferences: NotificationPreferences,
  ): Promise<NotificationPreferences> => {
    const { data } = await axiosInstance.patch<ApiResponse<NotificationPreferences>>(
      '/users/me/notifications/preferences',
      preferences,
    )
    return requireApiData(data, 'Failed to update notification preferences')
  },
}

export default notificationService
