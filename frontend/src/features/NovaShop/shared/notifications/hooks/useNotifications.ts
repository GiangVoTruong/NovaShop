import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import notificationApiService from '../services/notificationApiService'

/** Prefix riêng — tránh trùng cache với notification preferences. */
export const NOTIFICATION_INBOX_QUERY_ROOT = ['notification-inbox'] as const

function notificationListKey(userId: string, page: number, size: number) {
  return [...NOTIFICATION_INBOX_QUERY_ROOT, userId, 'list', page, size] as const
}

function unreadCountKey(userId: string) {
  return [...NOTIFICATION_INBOX_QUERY_ROOT, userId, 'unread-count'] as const
}

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

export function useNotifications(page = 1, size = 20) {
  const { userId, queryEnabled } = useNotificationUserId()

  return useQuery({
    queryKey: notificationListKey(userId!, page, size),
    queryFn: () => notificationApiService.getNotifications(userId!, page, size),
    enabled: queryEnabled,
    staleTime: 30_000,
  })
}

export function useUnreadNotificationCount() {
  const { userId, queryEnabled } = useNotificationUserId()

  return useQuery({
    queryKey: unreadCountKey(userId!),
    queryFn: () => notificationApiService.getUnreadCount(userId!),
    enabled: queryEnabled,
    staleTime: 15_000,
  })
}

function useInvalidateNotificationInbox() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: NOTIFICATION_INBOX_QUERY_ROOT })
}

export function useMarkNotificationRead() {
  const { userId } = useNotificationUserId()
  const invalidateInbox = useInvalidateNotificationInbox()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApiService.markAsRead(requireUserId(userId), notificationId),
    onSuccess: invalidateInbox,
  })
}

export function useMarkAllNotificationsRead() {
  const { userId } = useNotificationUserId()
  const invalidateInbox = useInvalidateNotificationInbox()

  return useMutation({
    mutationFn: () => notificationApiService.markAllAsRead(requireUserId(userId)),
    onSuccess: invalidateInbox,
  })
}
