import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { ValidateCouponRequest, ValidateCouponResponse } from '@/types/coupon.types'
import type { ApiResponse } from '@/types/api.types'

const couponService = {
  validateCoupon: async (request: ValidateCouponRequest): Promise<ValidateCouponResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<ValidateCouponResponse>>(
      '/coupons/validate',
      request,
    )
    return requireApiData(data, 'Failed to validate coupon')
  },
}

export default couponService
