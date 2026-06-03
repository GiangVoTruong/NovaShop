import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DEFAULT_QUERY_STALE_TIME_MS } from '@/lib/query/queryConfig'
import wishlistService from '../services/wishlistService'

export const WISHLIST_QUERY_KEY = ['wishlist'] as const

export function useWishlist() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
    select: (response) => response.items,
  })
}

export function useWishlistCheck(productId: string | undefined) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: [...WISHLIST_QUERY_KEY, 'check', productId],
    queryFn: () => wishlistService.checkProduct(productId!),
    enabled: isAuthenticated && Boolean(productId),
    select: (response) => response.inWishlist,
    staleTime: DEFAULT_QUERY_STALE_TIME_MS,
    refetchOnMount: false,
  })
}

export function useAddToWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['wishlist', 'add'],
    mutationFn: (productId: string) => wishlistService.addItem(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY })
    },
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['wishlist', 'remove'],
    mutationFn: (productId: string) => wishlistService.removeItem(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY })
    },
  })
}

export function useToggleWishlist(productId: string | undefined) {
  const checkQuery = useWishlistCheck(productId)
  const addMutation = useAddToWishlist()
  const removeMutation = useRemoveFromWishlist()

  const inWishlist = checkQuery.data ?? false
  const isPending = addMutation.isPending || removeMutation.isPending

  const toggle = () => {
    if (!productId) {
      return
    }

    if (inWishlist) {
      removeMutation.mutate(productId)
      return
    }

    addMutation.mutate(productId)
  }

  return { inWishlist, isPending, toggle }
}
