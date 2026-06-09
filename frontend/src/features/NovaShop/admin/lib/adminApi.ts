import type { AdminCoupon, AdminOrderResponse } from '@/types/admin.types'
import type { ApiOrderStatus } from '@/types/order.types'
import { toCustomerOrderStatus } from '@/features/NovaShop/customer/orders/lib/orderApi'
import type { OrderStatus } from '@/features/NovaShop/shared/types'

export function toAdminAmount(value: number | string | null | undefined): number {
  if (value == null) {
    return 0
  }
  return typeof value === 'number' ? value : Number(value)
}

export function getCouponStatus(coupon: AdminCoupon): 'active' | 'paused' | 'expired' {
  if (!coupon.active) {
    return 'paused'
  }

  if (coupon.endAt && new Date(coupon.endAt).getTime() < Date.now()) {
    return 'expired'
  }

  return 'active'
}

export function getAdminOrderCode(order: Pick<AdminOrderResponse, 'id'>): string {
  return `NS-${order.id.slice(0, 8).toUpperCase()}`
}

export function getAdminOrderTotal(order: AdminOrderResponse): number {
  return toAdminAmount(order.finalAmount ?? order.totalAmount)
}

export function toAdminOrderUiStatus(status: ApiOrderStatus | string): OrderStatus {
  return toCustomerOrderStatus(status)
}

export const ADMIN_ORDER_STATUSES: ApiOrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPING',
  'DELIVERED',
  'DELIVERED_PENDING_RECEIVER_CONFIRM',
  'CANCELLED',
]
