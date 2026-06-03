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

/** Shipper: SHIPPING → DELIVERED_PENDING_RECEIVER_CONFIRM. */
export function canShipperSubmitDeliveryProof(
  status: ApiOrderStatus,
  hasDeliveryProof: boolean,
): boolean {
  return status === 'SHIPPING' && hasDeliveryProof
}

/** Khách: DELIVERED_PENDING_RECEIVER_CONFIRM → DELIVERED (BE set PAID nếu COD). */
export function canCustomerConfirmReceived(status: ApiOrderStatus): boolean {
  return status === 'DELIVERED_PENDING_RECEIVER_CONFIRM'
}

export const ORDER_STATUS_FLOW: ApiOrderStatus[] = [
  'CONFIRMED',
  'SHIPPING',
  'DELIVERED_PENDING_RECEIVER_CONFIRM',
  'DELIVERED',
]
