export type PaymentProvider = 'vnpay' | 'stripe'
export type PaymentReturnFeedback = 'success' | 'failed' | null

export function parsePaymentReturnFeedback(
  _provider: PaymentProvider,
  value: string | null,
): PaymentReturnFeedback {
  if (value === 'success' || value === 'failed') {
    return value
  }
  return null
}

export function ordersPathWithPaymentFeedback(
  provider: PaymentProvider,
  feedback: Exclude<PaymentReturnFeedback, null>,
  orderId: string,
): string {
  const params = new URLSearchParams({ [provider]: feedback, orderId })
  return `/orders?${params.toString()}`
}

/** @deprecated Use ordersPathWithPaymentFeedback('vnpay', ...) */
export function ordersPathWithVnpayFeedback(
  feedback: Exclude<PaymentReturnFeedback, null>,
  orderId: string,
): string {
  return ordersPathWithPaymentFeedback('vnpay', feedback, orderId)
}
