import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AppNotification } from '@/types/notification.types'
import {
  markAllNotificationsReadInCache,
  markNotificationReadInCache,
  notificationListKey,
  syncNotificationReadInCache,
  unreadCountKey,
} from '../lib/notificationQueryKeys'
import notificationApiService from '../services/notificationApiService'

/** Prefix riêng — tránh trùng cache với notification preferences. */
export const NOTIFICATION_INBOX_QUERY_ROOT = ['notification-inbox'] as const

const DEFAULT_PAGE = 1
const DEFAULT_SIZE = 20

function useNotificationUserId() {
  const { user, isAuthenticated } = useAuth()
  const userId = user?.id

  return {
    userId,
    queryEnabled: isAuthenticated && Boolean(userId),
  }
}

function requireUserId(userId: string | undefined): string {
  if (!userId) {
    throw new Error('Notification action requires an authenticated user')
  }
  return userId
}

export function useNotifications(page = DEFAULT_PAGE, size = DEFAULT_SIZE) {
  const { userId, queryEnabled } = useNotificationUserId()

  return useQuery({
    queryKey: notificationListKey(userId!, page, size),
    queryFn: () => notificationApiService.getNotifications(userId!, page, size),
    enabled: queryEnabled,
    staleTime: 60_000,
  })
}

export function useUnreadNotificationCount() {
  const { userId, queryEnabled } = useNotificationUserId()

  return useQuery({
    queryKey: unreadCountKey(userId!),
    queryFn: () => notificationApiService.getUnreadCount(userId!),
    enabled: queryEnabled,
    staleTime: 60_000,
  })
}

export function useMarkNotificationRead() {
  const { userId } = useNotificationUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApiService.markAsRead(requireUserId(userId), notificationId),
    onMutate: (notificationId) => {
      if (!userId) {
        return
      }
      markNotificationReadInCache(queryClient, userId, notificationId, DEFAULT_PAGE, DEFAULT_SIZE)
    },
    onSuccess: (updatedNotification) => {
      if (!userId) {
        return
      }
      syncNotificationReadInCache(
        queryClient,
        userId,
        updatedNotification as AppNotification,
        DEFAULT_PAGE,
        DEFAULT_SIZE,
      )
    },
    onError: (_error, notificationId) => {
      if (!userId) {
        return
      }
      void queryClient.invalidateQueries({
        queryKey: notificationListKey(userId, DEFAULT_PAGE, DEFAULT_SIZE),
      })
      void queryClient.invalidateQueries({ queryKey: unreadCountKey(userId) })
      console.error('[useMarkNotificationRead] failed for notification:', notificationId)
    },
  })
}

export function useMarkAllNotificationsRead() {
  const { userId } = useNotificationUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationApiService.markAllAsRead(requireUserId(userId)),
    onMutate: () => {
      if (!userId) {
        return
      }
      markAllNotificationsReadInCache(queryClient, userId, DEFAULT_PAGE, DEFAULT_SIZE)
    },
    onError: () => {
      if (!userId) {
        return
      }
      void queryClient.invalidateQueries({
        queryKey: notificationListKey(userId, DEFAULT_PAGE, DEFAULT_SIZE),
      })
      void queryClient.invalidateQueries({ queryKey: unreadCountKey(userId) })
      console.error('[useMarkAllNotificationsRead] failed')
    },
  })
}
