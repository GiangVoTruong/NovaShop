import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type {
  AdminCoupon,
  CreateAdminCouponRequest,
  UpdateAdminCouponRequest,
} from '@/types/admin.types'
import type { ApiResponse } from '@/types/api.types'

const adminCouponService = {
  getAll: async (): Promise<AdminCoupon[]> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminCoupon[]>>('/admin/coupons')
    return requireApiData(data, 'Failed to load coupons') ?? []
  },

  create: async (request: CreateAdminCouponRequest): Promise<AdminCoupon> => {
    const { data } = await axiosInstance.post<ApiResponse<AdminCoupon>>('/admin/coupons', request)
    return requireApiData(data, 'Failed to create coupon')
  },

  update: async (couponId: string, request: UpdateAdminCouponRequest): Promise<AdminCoupon> => {
    const { data } = await axiosInstance.put<ApiResponse<AdminCoupon>>(
      `/admin/coupons/${couponId}`,
      request,
    )
    return requireApiData(data, 'Failed to update coupon')
  },

  delete: async (couponId: string): Promise<void> => {
    await axiosInstance.delete(`/admin/coupons/${couponId}`)
  },
}

export default adminCouponService
