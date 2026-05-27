export type ApiOrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'

export type ApiPaymentMethod = 'COD' | 'VNPAY' | 'STRIPE'

export type ApiPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export type ApiOrderItemResponse = {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  subtotal: number
}

export type ApiOrderResponse = {
  id: string
  userId: string
  totalAmount: number
  finalAmount: number
  status: ApiOrderStatus
  paymentMethod: ApiPaymentMethod
  paymentStatus: ApiPaymentStatus
  items: ApiOrderItemResponse[]
  createdAt: string
  updatedAt: string
}

export type CheckoutRequest = {
  paymentMethod: ApiPaymentMethod
}
