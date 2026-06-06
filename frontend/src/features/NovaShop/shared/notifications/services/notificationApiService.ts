import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { AppNotification } from '@/types/notification.types'
import type { ApiResponse } from '@/types/api.types'

function notificationsBasePath(userId: string) {
  return `/users/${userId}/notifications`
}

const notificationApiService = {
  getNotifications: async (
    userId: string,
    page = 1,
    size = 20,
  ): Promise<AppNotification[]> => {
    const { data } = await axiosInstance.get<ApiResponse<AppNotification[]>>(
      notificationsBasePath(userId),
      { params: { page, size } },
    )
    return requireApiData(data, 'Failed to load notifications') ?? []
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    const { data } = await axiosInstance.get<ApiResponse<number>>(
      `${notificationsBasePath(userId)}/unread-count`,
    )
    return requireApiData(data, 'Failed to load unread count') ?? 0
  },

  markAsRead: async (userId: string, notificationId: string): Promise<AppNotification> => {
    const { data } = await axiosInstance.patch<ApiResponse<AppNotification>>(
      `${notificationsBasePath(userId)}/${notificationId}/read`,
    )
    return requireApiData(data, 'Failed to mark notification as read')
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await axiosInstance.patch(`${notificationsBasePath(userId)}/read-all`)
  },
}

export default notificationApiService
