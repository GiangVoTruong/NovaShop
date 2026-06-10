import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import orderService from '../services/orderService'

export const ORDERS_QUERY_KEY = ['orders'] as const

export function useOrders() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: orderService.getMyOrders,
    enabled: isAuthenticated,
  })
}

export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderService.getById(orderId!),
    enabled: Boolean(orderId),
  })
}

export function useCheckout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['checkout'],
    mutationFn: orderService.checkout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cancel-order'],
    mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })
    },
  })
}

export function useConfirmOrderReceived() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['confirm-order-received'],
    mutationFn: (orderId: string) => orderService.confirmReceived(orderId),
    onSuccess: async (_order, orderId) => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY })
      await queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
    },
  })
}
