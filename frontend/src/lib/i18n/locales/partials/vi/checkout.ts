export const checkout = {
  stepLabel: 'Checkout step 2/2',
  title: 'Thanh toán',
  titleHighlight: 'đơn hàng',
  backToCart: 'Quay lại giỏ hàng',
  backToProduct: 'Quay lại sản phẩm',
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
  address: {
    empty: 'Bạn chưa có địa chỉ giao hàng.',
    addLink: 'Thêm tại Hồ sơ',
    default: 'Mặc định',
  },
  coupon: {
    title: 'Mã giảm giá',
    placeholder: 'Nhập mã',
    apply: 'Áp dụng',
    applied: 'Áp dụng mã thành công',
    invalid: 'Mã không hợp lệ',
    failed: 'Không thể kiểm tra mã',
    discount: 'Giảm {{amount}}',
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
    vnpay: {
      title: 'VNPAY',
      desc: 'Thanh toán qua cổng VNPAY',
    },
    stripe: {
      title: 'Stripe',
      desc: 'Thẻ quốc tế qua Stripe',
    },
  },
  order: {
    title: 'Đơn hàng của bạn',
    subtotal: 'Tạm tính',
    discount: 'Giảm giá',
    shipping: 'Phí giao hàng',
    tax: 'Thuế (5%)',
    total: 'Tổng cộng',
    free: 'Miễn phí',
    placeOrder: 'Đặt hàng ngay',
    placeOrderVnpay: 'Thanh toán VNPay',
    placeOrderStripe: 'Thanh toán Stripe',
    termsPrefix: 'Khi đặt hàng bạn đồng ý với',
    terms: 'Điều khoản',
    termsSuffix: 'của NovaShop',
  },
  messages: {
    success: '🎉 Đặt hàng thành công!',
    failed: 'Không thể đặt hàng. Vui lòng thử lại.',
    noAddress: 'Vui lòng chọn địa chỉ giao hàng',
    cartRestoreFailed:
      'Đơn hàng đã được tạo, nhưng không thể khôi phục giỏ hàng. Mở trang giỏ hàng để thử lại.',
  },
  vnpay: {
    createFailed: 'Không thể tạo liên kết VNPay. Bạn có thể thanh toán lại tại trang đơn hàng.',
    notConfigured:
      'VNPay chưa được cấu hình trên server. Liên hệ quản trị viên hoặc chọn thanh toán COD.',
    redirecting: 'Đang chuyển sang cổng thanh toán VNPay…',
  },
  stripe: {
    createFailed: 'Không thể tạo phiên Stripe. Bạn có thể thanh toán lại tại trang đơn hàng.',
    notConfigured:
      'Stripe chưa được cấu hình trên server. Liên hệ quản trị viên hoặc chọn thanh toán COD.',
    redirecting: 'Đang chuyển sang Stripe…',
  },
} as const
