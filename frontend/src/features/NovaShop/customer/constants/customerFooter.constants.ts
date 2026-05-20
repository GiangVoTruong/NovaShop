import { PATHS } from '@/router/paths'

export const CUSTOMER_FOOTER_COLS = [
  {
    title: 'Mua sắm',
    links: [
      { label: 'Sản phẩm mới', to: PATHS.PRODUCTS },
      { label: 'Khuyến mãi', to: PATHS.FLASH_SALE },
      { label: 'Bestseller', to: PATHS.PRODUCTS },
      { label: 'Bộ sưu tập', to: PATHS.COLLECTIONS },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Trung tâm hỗ trợ', to: '#' },
      { label: 'Vận chuyển', to: '#' },
      { label: 'Đổi trả & hoàn tiền', to: '#' },
      { label: 'Bảo hành', to: '#' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về NovaShop', to: '#' },
      { label: 'Tuyển dụng', to: '#' },
      { label: 'Liên hệ', to: '#' },
      { label: 'Chính sách', to: '#' },
    ],
  },
  {
    title: 'Tài khoản',
    links: [
      { label: 'Đăng nhập', to: PATHS.LOGIN },
      { label: 'Đăng ký', to: PATHS.REGISTER },
      { label: 'Đơn hàng', to: PATHS.ORDERS },
      { label: 'Hồ sơ', to: PATHS.PROFILE },
    ],
  },
]

export const CUSTOMER_SOCIAL_LINKS = [
  { label: 'Facebook', initial: 'F' },
  { label: 'Instagram', initial: 'I' },
  { label: 'TikTok', initial: 'T' },
  { label: 'YouTube', initial: 'Y' },
]
