import type { OrderStatus } from '../types'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  packing: 'Đang đóng gói',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  delivered_pending_receiver_confirm: 'Chờ người nhận xác nhận',
  cancelled: 'Đã huỷ',
}

export const ORDER_STATUS_TONE: Record<
  OrderStatus,
  'amber' | 'indigo' | 'cyan' | 'blue' | 'emerald' | 'rose' | 'purple'
> = {
  pending: 'amber',
  confirmed: 'indigo',
  packing: 'purple',
  shipping: 'cyan',
  delivered: 'emerald',
  delivered_pending_receiver_confirm: 'blue',
  cancelled: 'rose',
}

export const PRODUCT_STATUS_LABEL = {
  active: 'Đang bán',
  draft: 'Bản nháp',
  out_of_stock: 'Hết hàng',
} as const

export const PRODUCT_STATUS_TONE = {
  active: 'emerald',
  draft: 'amber',
  out_of_stock: 'rose',
} as const
