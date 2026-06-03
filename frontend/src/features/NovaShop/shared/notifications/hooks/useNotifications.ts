import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'

import notificationApiService from '../services/notificationApiService'

/** Prefix riêng — tránh trùng cache với notification preferences. */
export const NOTIFICATION_INBOX_QUERY_ROOT = ['notification-inbox'] as const

function inboxQueryKeys(userId: string | undefined) {
  return {
    list: (page: number, size: number) =>
      [...NOTIFICATION_INBOX_QUERY_ROOT, userId, 'list', page, size] as const,
    unreadCount: [...NOTIFICATION_INBOX_QUERY_ROOT, userId, 'unread-count'] as const,
  }
}

export function useNotifications(page = 1, size = 20) {
  const { user, isAuthenticated } = useAuth()
  const userId = user?.id
  const keys = inboxQueryKeys(userId)

  return useQuery({
    queryKey: keys.list(page, size),
    queryFn: () => notificationApiService.getNotifications(userId!, page, size),
    enabled: isAuthenticated && Boolean(userId),
    staleTime: 30_000,
  })
}

export function useUnreadNotificationCount() {
  const { user, isAuthenticated } = useAuth()
  const userId = user?.id
  const keys = inboxQueryKeys(userId)

  return useQuery({
    queryKey: keys.unreadCount,
    queryFn: () => notificationApiService.getUnreadCount(userId!),
    enabled: isAuthenticated && Boolean(userId),
    staleTime: 15_000,
  })
}

export function useMarkNotificationRead() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => {
      if (!userId) {
        throw new Error('Cannot mark notification as read without user id')
      }
      return notificationApiService.markAsRead(userId, notificationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_INBOX_QUERY_ROOT })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      if (!userId) {
        throw new Error('Cannot mark all notifications as read without user id')
      }
      return notificationApiService.markAllAsRead(userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_INBOX_QUERY_ROOT })
    },
  })
}
