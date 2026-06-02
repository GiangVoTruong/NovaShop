import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import orderService from '../services/orderService'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getMyOrders,
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
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
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
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
