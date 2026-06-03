import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { AppNotification } from '@/types/notification.types'
import type { ApiResponse } from '@/types/product.types'

const notificationApiService = {
  getNotifications: async (page = 1, size = 20): Promise<AppNotification[]> => {
    const { data } = await axiosInstance.get<ApiResponse<AppNotification[]>>('/notifications', {
      params: { page, size },
    })
    return requireApiData(data, 'Failed to load notifications') ?? []
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await axiosInstance.get<ApiResponse<number>>('/notifications/unread-count')
    return requireApiData(data, 'Failed to load unread count') ?? 0
  },

  markAsRead: async (notificationId: string): Promise<AppNotification> => {
    const { data } = await axiosInstance.patch<ApiResponse<AppNotification>>(
      `/notifications/${notificationId}/read`,
    )
    return requireApiData(data, 'Failed to mark notification as read')
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch('/notifications/read-all')
  },
}

export default notificationApiService
