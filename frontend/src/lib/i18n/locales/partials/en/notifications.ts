export const notifications = {
  title: 'Notifications',
  empty: 'No notifications yet',
  markAllRead: 'Mark all as read',
  events: {
    orderPlaced: {
      title: 'Order placed',
      message: 'Your order {{orderCode}} has been placed successfully.',
    },
    orderStatusUpdated: {
      title: 'Order status updated',
      message: 'Order {{orderCode}} is now {{status}}.',
    },
    orderCancelled: {
      title: 'Order cancelled',
      message: 'Your order {{orderCode}} has been cancelled.',
    },
    newOrderReceived: {
      title: 'New order received',
      message: 'Order {{orderCode}} was placed by {{customerName}}.',
    },
  },
} as const
