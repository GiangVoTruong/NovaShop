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
  isRead: boolean
  createdAt: string
}
