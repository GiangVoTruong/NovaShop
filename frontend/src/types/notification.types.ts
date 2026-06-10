export type NotificationPreferences = {
  orderEmail: boolean
  promoEmail: boolean
  securitySms: boolean
  deliveryPush: boolean
}

export type NotificationType = 'ORDER_STATUS' | 'PROMOTION' | 'SYSTEM'

export type AppNotification = {
  id: string
  type: NotificationType
  title: string
  message: string
  metadata?: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}
