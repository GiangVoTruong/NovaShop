import type { ApiPaymentMethod } from '@/types/order.types'

export type CheckoutPaymentOption = 'card' | 'momo' | 'bank' | 'cod'

const CHECKOUT_TO_API: Record<CheckoutPaymentOption, ApiPaymentMethod> = {
  cod: 'COD',
  card: 'STRIPE',
  momo: 'VNPAY',
  bank: 'VNPAY',
}

export function toApiPaymentMethod(payment: CheckoutPaymentOption): ApiPaymentMethod {
  return CHECKOUT_TO_API[payment]
}
