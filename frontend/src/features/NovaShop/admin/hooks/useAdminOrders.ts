import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AdminOrdersListParams, DeliverOrderRequest, UpdateOrderStatusRequest } from '@/types/admin.types'
import adminOrderService from '../services/adminOrderService'

export const ADMIN_ORDERS_QUERY_KEY = ['admin', 'orders'] as const

export function useAdminOrders(params: AdminOrdersListParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, params],
    queryFn: () => adminOrderService.getAllOrders(params),
  })
}

export function useAdminOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, orderId],
    queryFn: () => adminOrderService.getById(orderId!),
    enabled: Boolean(orderId),
  })
}

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['admin', 'orders', 'update-status'],
    mutationFn: ({
      orderId,
      request,
    }: {
      orderId: string
      request: UpdateOrderStatusRequest
    }) => adminOrderService.updateStatus(orderId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY })
    },
  })
}

export function useDeliverAdminOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['admin', 'orders', 'deliver'],
    mutationFn: ({
      orderId,
      request,
    }: {
      orderId: string
      request: DeliverOrderRequest
    }) => adminOrderService.deliverOrder(orderId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_QUERY_KEY })
    },
  })
}
