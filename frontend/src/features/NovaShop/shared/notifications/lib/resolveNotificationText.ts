import type { AppNotification } from '@/types/notification.types'
import type { TFunction } from 'i18next'

const I18N_EVENT_PREFIX = 'notifications.events.'

export function formatOrderCodeFromId(orderId: string): string {
  return `NS-${orderId.slice(0, 8).toUpperCase()}`
}

function parseNotificationParams(message: string): Record<string, unknown> | null {
  try {
    const params = JSON.parse(message) as Record<string, unknown>
    return params && typeof params === 'object' ? params : null
  } catch {
    return null
  }
}

function enrichNotificationParams(
  params: Record<string, unknown>,
  translate: TFunction,
): Record<string, unknown> {
  const enriched: Record<string, unknown> = { ...params }

  if (typeof params.orderId === 'string') {
    enriched.orderCode = formatOrderCodeFromId(params.orderId)
  }

  if (typeof params.status === 'string') {
    enriched.status = translate(`status.order.${params.status.toLowerCase()}`)
  }

  return enriched
}

export function resolveNotificationText(
  notification: AppNotification,
  translate: TFunction,
): { title: string; message: string } {
  if (!notification.title.startsWith(I18N_EVENT_PREFIX)) {
    return {
      title: notification.title,
      message: notification.message,
    }
  }

  const params = parseNotificationParams(notification.message)
  if (!params) {
    return {
      title: translate(`${notification.title}.title`),
      message: notification.message,
    }
  }

  const enrichedParams = enrichNotificationParams(params, translate)

  return {
    title: translate(`${notification.title}.title`, enrichedParams),
    message: translate(`${notification.title}.message`, enrichedParams),
  }
}
