export type ApiOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPING'
  | 'DELIVERED_PENDING_RECEIVER_CONFIRM'
  | 'DELIVERED'
  | 'CANCELLED'

export type ApiPaymentMethod = 'COD' | 'VNPAY' | 'STRIPE'

export type ApiPaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED'

export type ApiOrderItemResponse = {
  id: string
  productId: string
  productName: string
  productImageUrl?: string | null
  price: number
  quantity: number
  subtotal: number
}

export type ApiOrderShippingAddress = {
  addressId?: string | null
  fullName?: string | null
  phone?: string | null
  province?: string | null
  district?: string | null
  ward?: string | null
  detail?: string | null
}

export type ApiOrderResponse = {
  id: string
  userId: string
  totalAmount: number
  finalAmount: number
  status: ApiOrderStatus
  paymentMethod: ApiPaymentMethod
  paymentStatus: ApiPaymentStatus
  shippingAddress?: ApiOrderShippingAddress | null
  note?: string | null
  deliveryProofUrl?: string | null
  deliveredAt?: string | null
  trackingCode?: string | null
  items: ApiOrderItemResponse[]
  createdAt: string
  updatedAt: string
}

export type CheckoutRequest = {
  paymentMethod: ApiPaymentMethod
  addressId: string
  couponCode?: string
  note?: string
}
