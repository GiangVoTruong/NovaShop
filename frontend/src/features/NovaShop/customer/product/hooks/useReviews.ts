import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateReviewRequest } from '@/types/review.types'
import reviewService from '../services/reviewService'

export function useProductReviews(productId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getProductReviews(productId!),
    enabled: Boolean(productId),
  })
}

export function useCreateReview(productId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['reviews', 'create', productId],
    mutationFn: (request: CreateReviewRequest) => reviewService.createReview(productId!, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
    },
  })
}

export function useDeleteReview(productId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['reviews', 'delete'],
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
    },
  })
}
