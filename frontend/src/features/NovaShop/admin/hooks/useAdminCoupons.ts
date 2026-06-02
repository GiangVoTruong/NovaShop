import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateAdminCouponRequest, UpdateAdminCouponRequest } from '@/types/admin.types'
import adminCouponService from '../services/adminCouponService'

export const ADMIN_COUPONS_QUERY_KEY = ['admin', 'coupons'] as const

export function useAdminCoupons() {
  return useQuery({
    queryKey: ADMIN_COUPONS_QUERY_KEY,
    queryFn: adminCouponService.getAll,
  })
}

export function useCreateAdminCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['admin', 'coupons', 'create'],
    mutationFn: (request: CreateAdminCouponRequest) => adminCouponService.create(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_QUERY_KEY })
    },
  })
}

export function useUpdateAdminCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['admin', 'coupons', 'update'],
    mutationFn: ({
      couponId,
      request,
    }: {
      couponId: string
      request: UpdateAdminCouponRequest
    }) => adminCouponService.update(couponId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_QUERY_KEY })
    },
  })
}

export function useDeleteAdminCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['admin', 'coupons', 'delete'],
    mutationFn: (couponId: string) => adminCouponService.delete(couponId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_COUPONS_QUERY_KEY })
    },
  })
}
