export const checkout = {
  stepLabel: 'Checkout step 2/2',
  title: 'Thanh toán',
  titleHighlight: 'đơn hàng',
  backToCart: 'Quay lại giỏ hàng',
  empty: {
    title: 'Giỏ hàng trống',
    description: 'Thêm sản phẩm vào giỏ trước khi thanh toán.',
    shopNow: 'Mua sắm ngay',
  },
  sections: {
    address: 'Địa chỉ giao hàng',
    delivery: 'Phương thức giao hàng',
    payment: 'Phương thức thanh toán',
  },
  fields: {
    fullName: 'Họ và tên',
    phone: 'Số điện thoại',
    email: 'Email',
    city: 'Tỉnh / Thành phố',
    district: 'Quận / Huyện',
    address: 'Địa chỉ chi tiết',
    note: 'Ghi chú đơn hàng',
    notePlaceholder: 'Ghi chú cho người giao hàng…',
    cardNumber: 'Số thẻ',
    cardHolder: 'Tên chủ thẻ',
    cardExpiry: 'Ngày hết hạn',
  },
  cities: {
    hcm: 'TP. Hồ Chí Minh',
    hanoi: 'Hà Nội',
    danang: 'Đà Nẵng',
  },
  districts: {
    q1: 'Quận 1',
    q3: 'Quận 3',
    q7: 'Quận 7',
  },
  delivery: {
    standard: {
      title: 'Giao hàng tiêu chuẩn',
      desc: '3 - 5 ngày làm việc',
    },
    express: {
      title: 'Giao 2 giờ ⚡',
      desc: 'Trong nội thành TP.HCM & HN',
    },
    pickup: {
      title: 'Nhận tại cửa hàng',
      desc: 'Sẵn sàng sau 30 phút',
    },
  },
  payment: {
    card: {
      title: 'Thẻ tín dụng / ghi nợ',
      desc: 'Visa, Mastercard, JCB',
    },
    momo: {
      title: 'Ví MoMo',
      desc: 'Thanh toán nhanh qua MoMo',
    },
    bank: {
      title: 'Chuyển khoản',
      desc: 'Internet Banking / QR Code',
    },
    cod: {
      title: 'COD - Tiền mặt',
      desc: 'Thanh toán khi nhận hàng',
    },
  },
  order: {
    title: 'Đơn hàng của bạn',
    subtotal: 'Tạm tính',
    shipping: 'Phí giao hàng',
    tax: 'Thuế (5%)',
    total: 'Tổng cộng',
    free: 'Miễn phí',
    placeOrder: 'Đặt hàng ngay',
    termsPrefix: 'Khi đặt hàng bạn đồng ý với',
    terms: 'Điều khoản',
    termsSuffix: 'của NovaShop',
  },
  messages: {
    success: '🎉 Đặt hàng thành công! Mã đơn: NS-2026-99999',
  },
} as const
