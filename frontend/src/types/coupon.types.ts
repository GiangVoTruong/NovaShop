export type CouponType = 'PERCENT' | 'FIXED'

export type ValidateCouponRequest = {
  code: string
  cartTotal: number
}

export type ValidateCouponResponse = {
  valid: boolean
  discountAmount: number
  message: string
  coupon: {
    code: string
    type: CouponType
    value: number
  } | null
}
