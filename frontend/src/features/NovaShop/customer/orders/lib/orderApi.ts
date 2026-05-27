import type { ApiOrderResponse, ApiOrderStatus, ApiPaymentMethod } from '@/types/order.types'
import type { OrderStatus } from '@/features/NovaShop/shared/types'

export const ORDER_ITEM_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop'

const CUSTOMER_ORDER_STATUS: Record<ApiOrderStatus, OrderStatus> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

const PAYMENT_METHOD_LABELS: Record<ApiPaymentMethod, string> = {
  COD: 'Thanh toán khi nhận hàng (COD)',
  VNPAY: 'VNPAY',
  STRIPE: 'Thẻ tín dụng / Stripe',
}

export function toOrderNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value)
}

export function getOrderCode(order: ApiOrderResponse): string {
  return `NS-${order.id.slice(0, 8).toUpperCase()}`
}

export function getOrderTotal(order: ApiOrderResponse): number {
  return toOrderNumber(order.finalAmount ?? order.totalAmount)
}

export function getOrderSubtotal(order: ApiOrderResponse): number {
  return toOrderNumber(order.totalAmount)
}

export function toCustomerOrderStatus(status: ApiOrderStatus): OrderStatus {
  return CUSTOMER_ORDER_STATUS[status]
}

export function getPaymentMethodLabel(method: ApiPaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] ?? method
}

export function isOrderCancellable(order: ApiOrderResponse): boolean {
  return order.status === 'PENDING' || order.status === 'CONFIRMED'
}
