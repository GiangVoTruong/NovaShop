import { useMutation } from '@tanstack/react-query'
import type { ValidateCouponRequest } from '@/types/coupon.types'
import couponService from '../services/couponService'

export function useValidateCoupon() {
  return useMutation({
    mutationKey: ['coupon', 'validate'],
    mutationFn: (request: ValidateCouponRequest) => couponService.validateCoupon(request),
  })
}
