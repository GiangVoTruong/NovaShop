export const notifications = {
  title: 'Thông báo',
  empty: 'Chưa có thông báo',
  markAllRead: 'Đánh dấu tất cả đã đọc',
  events: {
    orderPlaced: {
      title: 'Đặt hàng thành công',
      message: 'Đơn hàng {{orderCode}} của bạn đã được đặt thành công.',
    },
    orderStatusUpdated: {
      title: 'Cập nhật trạng thái đơn',
      message: 'Đơn hàng {{orderCode}} đã chuyển sang {{status}}.',
    },
    orderCancelled: {
      title: 'Đơn hàng đã huỷ',
      message: 'Đơn hàng {{orderCode}} của bạn đã được huỷ.',
    },
    newOrderReceived: {
      title: 'Có đơn hàng mới',
      message: 'Đơn hàng {{orderCode}} vừa được đặt bởi {{customerName}}.',
    },
  },
} as const
