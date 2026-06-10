export type CreateVnpayPaymentRequest = {
  orderId: string
}

export type CreateVnpayPaymentResponse = {
  paymentUrl: string
  txnRef: string
}

export type CreateStripePaymentRequest = {
  orderId: string
}

export type CreateStripePaymentResponse = {
  checkoutUrl: string
  sessionId: string
}
