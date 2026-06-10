export const status = {
  order: {
    awaiting_payment: 'Chờ thanh toán',
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    packing: 'Đang đóng gói',
    shipping: 'Đang giao',
    delivered_pending_receiver_confirm: 'Chờ người nhận xác nhận',
    delivered: 'Đã giao',
    cancelled: 'Đã huỷ',
  },
  product: {
    active: 'Đang bán',
    draft: 'Bản nháp',
    out_of_stock: 'Hết hàng',
  },
  category: {
    electronics: 'Điện tử',
    fashion: 'Thời trang',
    gaming: 'Gaming',
    office: 'Văn phòng',
    home: 'Nhà cửa',
    beauty: 'Làm đẹp',
  },
  coupon: {
    active: 'Đang hoạt động',
    expired: 'Đã hết hạn',
    paused: 'Tạm dừng',
  },
  customer: {
    active: 'Hoạt động',
    inactive: 'Ngưng',
    inactiveFull: 'Ngưng hoạt động',
  },
} as const
