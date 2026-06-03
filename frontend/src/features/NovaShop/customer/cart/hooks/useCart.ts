import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AddCartItemRequest, UpdateCartItemRequest } from '@/types/cart.types'
import cartService from '../services/cartService'

export const CART_QUERY_KEY = ['cart'] as const

export function useCart() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  })
}

export function useCartItemCount(): number {
  const { isAuthenticated } = useAuth()

  const cartCountQuery = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
    select: (cart) => cart.itemCount,
  })

  return cartCountQuery.data ?? 0
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cart', 'add'],
    mutationFn: (request: AddCartItemRequest) => cartService.addItem(request),
    onSuccess: async (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cart', 'update'],
    mutationFn: ({
      itemId,
      request,
    }: {
      itemId: string
      request: UpdateCartItemRequest
    }) => cartService.updateItem(itemId, request),
    onSuccess: async (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cart', 'remove'],
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: async (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['cart', 'clear'],
    mutationFn: cartService.clearAllItems,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}
