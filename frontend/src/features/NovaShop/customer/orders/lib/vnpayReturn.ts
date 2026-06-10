import {
  parsePaymentReturnFeedback,
  type PaymentProvider,
  type PaymentReturnFeedback,
} from './paymentReturn'

export type { PaymentProvider, PaymentReturnFeedback }
export { ordersPathWithPaymentFeedback, ordersPathWithVnpayFeedback, parsePaymentReturnFeedback } from './paymentReturn'

export type VnpayReturnFeedback = PaymentReturnFeedback

export function parseVnpayReturnFeedback(value: string | null): PaymentReturnFeedback {
  return parsePaymentReturnFeedback('vnpay', value)
}
