import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { ApiReviewResponse, CreateReviewRequest } from '@/types/review.types'
import type { ApiResponse } from '@/types/product.types'

const reviewService = {
  getProductReviews: async (productId: string): Promise<ApiReviewResponse[]> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiReviewResponse[]>>(
      `/products/${productId}/reviews`,
    )
    return requireApiData(data, 'Failed to load reviews') ?? []
  },

  createReview: async (
    productId: string,
    request: CreateReviewRequest,
  ): Promise<ApiReviewResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<ApiReviewResponse>>(
      `/products/${productId}/reviews`,
      request,
    )
    return requireApiData(data, 'Failed to create review')
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    await axiosInstance.delete(`/reviews/${reviewId}`)
  },
}

export default reviewService
