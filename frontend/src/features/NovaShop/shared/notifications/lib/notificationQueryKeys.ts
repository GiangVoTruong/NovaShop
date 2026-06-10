import { ADMIN_ANALYTICS_QUERY_KEY } from '@/features/NovaShop/admin/hooks/useAdminAnalytics'
import { ADMIN_ORDERS_QUERY_KEY } from '@/features/NovaShop/admin/hooks/useAdminOrders'
import { ORDERS_QUERY_KEY } from '@/features/NovaShop/customer/orders/hooks/useOrders'
import type { AppNotification } from '@/types/notification.types'
import i18n from '@/lib/i18n/config'
import { notification as antdNotification } from 'antd'
import type { QueryClient } from '@tanstack/react-query'
import { NOTIFICATION_INBOX_QUERY_ROOT } from '../hooks/useNotifications'
import { resolveNotificationText } from './resolveNotificationText'

export function notificationListKey(userId: string, page: number, size: number) {
  return [...NOTIFICATION_INBOX_QUERY_ROOT, userId, 'list', page, size] as const
}

export function unreadCountKey(userId: string) {
  return [...NOTIFICATION_INBOX_QUERY_ROOT, userId, 'unread-count'] as const
}

export function applyIncomingNotification(
  queryClient: QueryClient,
  userId: string,
  notification: AppNotification,
  page = 1,
  size = 20,
) {
  queryClient.setQueryData<number>(unreadCountKey(userId), (currentCount = 0) => {
    if (notification.isRead) {
      return currentCount
    }
    return currentCount + 1
  })

  queryClient.setQueryData<AppNotification[]>(
    notificationListKey(userId, page, size),
    (currentList = []) => [
      notification,
      ...currentList.filter((entry) => entry.id !== notification.id),
    ],
  )
}

export function markNotificationReadInCache(
  queryClient: QueryClient,
  userId: string,
  notificationId: string,
  page = 1,
  size = 20,
) {
  let wasUnread = false

  queryClient.setQueryData<AppNotification[]>(
    notificationListKey(userId, page, size),
    (currentList = []) =>
      currentList.map((entry) => {
        if (entry.id !== notificationId) {
          return entry
        }
        if (!entry.isRead) {
          wasUnread = true
        }
        return { ...entry, isRead: true }
      }),
  )

  if (wasUnread) {
    queryClient.setQueryData<number>(unreadCountKey(userId), (currentCount = 0) =>
      Math.max(0, currentCount - 1),
    )
  }
}

export function markAllNotificationsReadInCache(
  queryClient: QueryClient,
  userId: string,
  page = 1,
  size = 20,
) {
  queryClient.setQueryData<AppNotification[]>(
    notificationListKey(userId, page, size),
    (currentList = []) => currentList.map((entry) => ({ ...entry, isRead: true })),
  )
  queryClient.setQueryData<number>(unreadCountKey(userId), 0)
}

export function syncNotificationReadInCache(
  queryClient: QueryClient,
  userId: string,
  updatedNotification: AppNotification,
  page = 1,
  size = 20,
) {
  queryClient.setQueryData<AppNotification[]>(
    notificationListKey(userId, page, size),
    (currentList = []) =>
      currentList.map((entry) =>
        entry.id === updatedNotification.id ? { ...entry, ...updatedNotification, isRead: true } : entry,
      ),
  )
}

/** Toast realtime — không dùng thêm message.success ở mutation khi BE đã gửi notification. */
export function applyRealtimeSideEffects(
  queryClient: QueryClient,
  incoming: AppNotification,
) {
  const { title, message } = resolveNotificationText(incoming, i18n.t.bind(i18n))

  antdNotification.info({
    message: title,
    description: message,
    placement: 'topRight',
    duration: 5,
  })

  if (incoming.type !== 'ORDER_STATUS') {
    return
  }

  void queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })
  void queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY })
  void queryClient.invalidateQueries({ queryKey: ADMIN_ANALYTICS_QUERY_KEY })
}
