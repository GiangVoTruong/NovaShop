import { adminOrderDetailPath, orderDetailPath } from '@/router/paths'
import type { AppNotification } from '@/types/notification.types'
import { getNotificationOrderId } from './notificationParams'

export type NotificationLinkMode = 'customer' | 'admin'

export function getNotificationTargetPath(
  notification: AppNotification,
  linkMode: NotificationLinkMode = 'customer',
): string | null {
  const orderId = getNotificationOrderId(notification)
  if (!orderId) {
    return null
  }

  return linkMode === 'admin' ? adminOrderDetailPath(orderId) : orderDetailPath(orderId)
}
