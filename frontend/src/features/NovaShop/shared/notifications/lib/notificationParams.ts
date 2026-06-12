import type { AppNotification } from '@/types/notification.types'

export function parseNotificationParams(message: string): Record<string, unknown> | null {
  try {
    const params = JSON.parse(message) as Record<string, unknown>
    return params && typeof params === 'object' ? params : null
  } catch {
    return null
  }
}

export function formatOrderCodeFromId(orderId: string): string {
  return `NS-${orderId.slice(0, 8).toUpperCase()}`
}

export function getNotificationOrderId(notification: AppNotification): string | null {
  const metadataOrderId = notification.metadata?.orderId
  if (typeof metadataOrderId === 'string' && metadataOrderId.length > 0) {
    return metadataOrderId
  }

  const params = parseNotificationParams(notification.message)
  const messageOrderId = params?.orderId
  if (typeof messageOrderId === 'string' && messageOrderId.length > 0) {
    return messageOrderId
  }

  return null
}

export function buildNotificationMetadata(
  notification: Pick<AppNotification, 'title' | 'message' | 'metadata'>,
): Record<string, unknown> | null {
  if (notification.metadata && Object.keys(notification.metadata).length > 0) {
    return notification.metadata
  }

  const params = parseNotificationParams(notification.message)
  if (!params) {
    return null
  }

  return {
    eventKey: notification.title,
    ...params,
  }
}
