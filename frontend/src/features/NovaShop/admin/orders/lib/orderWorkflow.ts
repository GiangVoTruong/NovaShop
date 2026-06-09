import { normalizeApiOrderStatus } from '@/features/NovaShop/customer/orders/lib/orderApi'
import type { ApiOrderStatus } from '@/types/order.types'

export type OrderWorkflowRole = 'shop' | 'shipper' | 'customer'

export function getWorkflowOrderStatus(status: string): ApiOrderStatus {
  return normalizeApiOrderStatus(status)
}

export function canShopConfirmOrder(status: ApiOrderStatus): boolean {
  return status === 'PENDING'
}

/** Shop: CONFIRMED → SHIPPING (shipper đang trên đường). */
export function canShopStartShipping(status: ApiOrderStatus): boolean {
  return status === 'CONFIRMED'
}

/** Shipper: SHIPPING → DELIVERED (đã giao hàng). */
export function canShipperSubmitDeliveryProof(
  status: ApiOrderStatus,
  hasDeliveryProof: boolean,
): boolean {
  return status === 'SHIPPING' && hasDeliveryProof
}

/** Khách: DELIVERED → DELIVERED_PENDING_RECEIVER_CONFIRM (BE set PAID nếu COD). */
export function canCustomerConfirmReceived(status: ApiOrderStatus): boolean {
  return status === 'DELIVERED'
}

export const ORDER_STATUS_FLOW: ApiOrderStatus[] = [
  'CONFIRMED',
  'SHIPPING',
  'DELIVERED',
  'DELIVERED_PENDING_RECEIVER_CONFIRM',
]

/** Bước đang chờ xử lý trên UI (DELIVERED = đã giao, đang chờ khách xác nhận). */
export function getWorkflowHighlightStatus(status: ApiOrderStatus): ApiOrderStatus {
  if (status === 'DELIVERED') {
    return 'DELIVERED_PENDING_RECEIVER_CONFIRM'
  }
  return status
}
