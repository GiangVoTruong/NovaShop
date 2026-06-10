/**
 * Hằng số đường dẫn route — dùng thay cho hard-code chuỗi ở component/Link.
 * Khi đổi URL chỉ cần sửa ở đây, TS sẽ báo lỗi mọi nơi tham chiếu sai.
 */
export const PATHS = {
  HOME: '/',
  EXPLORE: '/explore',
  COLLECTIONS: '/collections',
  FLASH_SALE: '/flash-sale',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  WISHLIST: '/wishlist',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: '/admin/orders/:id',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]

export function productDetailPath(productId: string): string {
  return `/products/${productId}`
}

export function orderDetailPath(orderId: string): string {
  return `/orders/${orderId}`
}

export function adminOrderDetailPath(orderId: string): string {
  return `/admin/orders/${orderId}`
}
