import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'

import notificationApiService from '../services/notificationApiService'

export const NOTIFICATIONS_LIST_QUERY_KEY = ['notifications', 'list'] as const
export const NOTIFICATIONS_UNREAD_QUERY_KEY = ['notifications', 'unread-count'] as const

export function useNotifications(page = 1, size = 20) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: [...NOTIFICATIONS_LIST_QUERY_KEY, page, size],
    queryFn: () => notificationApiService.getNotifications(page, size),
    enabled: isAuthenticated,
    staleTime: 30_000,
  })
}

export function useUnreadNotificationCount() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: NOTIFICATIONS_UNREAD_QUERY_KEY,
    queryFn: notificationApiService.getUnreadCount,
    enabled: isAuthenticated,
    staleTime: 15_000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationApiService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationApiService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
