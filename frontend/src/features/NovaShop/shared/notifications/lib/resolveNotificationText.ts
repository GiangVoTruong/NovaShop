import type { AppNotification } from '@/types/notification.types'
import type { TFunction } from 'i18next'
import {
  formatOrderCodeFromId,
  parseNotificationParams,
} from './notificationParams'

const I18N_EVENT_PREFIX = 'notifications.events.'

const PAYMENT_STATUS_KEYS = new Set(['paid', 'unpaid', 'refunded'])

function resolveStatusLabel(status: string, translate: TFunction): string {
  const statusKey = status.toLowerCase()

  if (PAYMENT_STATUS_KEYS.has(statusKey)) {
    return translate(`status.payment.${statusKey}`)
  }

  return translate(`status.order.${statusKey}`, { defaultValue: status })
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
    enriched.status = resolveStatusLabel(params.status, translate)
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
