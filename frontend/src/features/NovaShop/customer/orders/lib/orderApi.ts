import type { OrderStatus } from '@/features/NovaShop/shared/types'
import type {
  ApiOrderResponse,
  ApiOrderShippingAddress,
  ApiOrderStatus,
  ApiOrderItemResponse,
  ApiPaymentMethod,
} from '@/types/order.types'

export const ORDER_ITEM_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop'

const CUSTOMER_ORDER_STATUS: Record<ApiOrderStatus, OrderStatus> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED_PENDING_RECEIVER_CONFIRM: 'delivered_pending_receiver_confirm',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export function normalizeApiOrderStatus(status: string): ApiOrderStatus {
  return status as ApiOrderStatus
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

export function toCustomerOrderStatus(status: ApiOrderStatus | string): OrderStatus {
  return CUSTOMER_ORDER_STATUS[normalizeApiOrderStatus(status)]
}

/** Trạng thái hiển thị — thanh toán online chưa trả → chờ thanh toán. */
export function toCustomerOrderDisplayStatus(order: ApiOrderResponse): OrderStatus {
  if (isVnpayAwaitingPayment(order) || isStripeAwaitingPayment(order)) {
    return 'awaiting_payment'
  }
  return toCustomerOrderStatus(order.status)
}

export function matchesCustomerOrderTab(
  order: ApiOrderResponse,
  tab: 'all' | OrderStatus,
): boolean {
  if (tab === 'all') {
    return true
  }

  const displayStatus = toCustomerOrderDisplayStatus(order)
  if (tab === 'pending') {
    return displayStatus === 'pending' || displayStatus === 'awaiting_payment'
  }

  return displayStatus === tab
}

export function isActiveCustomerOrder(order: ApiOrderResponse): boolean {
  const displayStatus = toCustomerOrderDisplayStatus(order)
  return (
    displayStatus === 'awaiting_payment' ||
    displayStatus === 'pending' ||
    displayStatus === 'shipping'
  )
}

export function getPaymentMethodLabel(method: ApiPaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] ?? method
}

export function isOrderCancellable(order: ApiOrderResponse): boolean {
  return order.status === 'PENDING' || order.status === 'CONFIRMED'
}

export function isVnpayAwaitingPayment(order: ApiOrderResponse): boolean {
  return isOnlinePaymentAwaiting(order, 'VNPAY')
}

export function isStripeAwaitingPayment(order: ApiOrderResponse): boolean {
  return isOnlinePaymentAwaiting(order, 'STRIPE')
}

export function isOnlinePaymentAwaiting(
  order: ApiOrderResponse,
  method: Extract<ApiPaymentMethod, 'VNPAY' | 'STRIPE'>,
): boolean {
  return (
    order.paymentMethod === method &&
    order.paymentStatus === 'UNPAID' &&
    order.status === 'PENDING'
  )
}

export function formatShippingAddress(
  shippingAddress: ApiOrderShippingAddress | null | undefined,
  fallback = '—',
): string {
  if (!shippingAddress) {
    return fallback
  }

  const location = [
    shippingAddress.detail,
    shippingAddress.ward,
    shippingAddress.district,
    shippingAddress.province,
  ]
    .filter(Boolean)
    .join(', ')

  const contact = [shippingAddress.fullName, shippingAddress.phone].filter(Boolean).join(' · ')
  const parts = [contact, location].filter(Boolean)

  return parts.length > 0 ? parts.join(' — ') : fallback
}

export function getOrderShippingLine(order: ApiOrderResponse, fallback = '—'): string {
  return formatShippingAddress(order.shippingAddress, fallback)
}

export function getOrderItemImageUrl(
  item: Pick<ApiOrderItemResponse, 'productImageUrl'>,
): string {
  return item.productImageUrl?.trim() || ORDER_ITEM_PLACEHOLDER_IMAGE
}

export function canCustomerConfirmReceived(order: ApiOrderResponse): boolean {
  return order.status === 'DELIVERED'
}
