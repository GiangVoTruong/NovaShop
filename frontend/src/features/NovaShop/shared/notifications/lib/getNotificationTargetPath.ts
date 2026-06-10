import { orderDetailPath } from '@/router/paths'
import type { AppNotification } from '@/types/notification.types'

export function getNotificationTargetPath(notification: AppNotification): string | null {
  const orderId = notification.metadata?.orderId
  if (typeof orderId === 'string' && orderId.length > 0) {
    return orderDetailPath(orderId)
  }
  return null
}
