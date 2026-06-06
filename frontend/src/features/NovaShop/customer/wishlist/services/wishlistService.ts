import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { ApiWishlistItemResponse, ApiWishlistResponse, WishlistCheckResponse } from '@/types/wishlist.types'
import type { ApiResponse } from '@/types/api.types'

const wishlistService = {
  getWishlist: async (): Promise<ApiWishlistResponse> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiWishlistResponse>>('/wishlist')
    return requireApiData(data, 'Failed to load wishlist')
  },

  addItem: async (productId: string): Promise<ApiWishlistItemResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<ApiWishlistItemResponse>>(
      '/wishlist/items',
      { productId },
    )
    return requireApiData(data, 'Failed to add to wishlist')
  },

  removeItem: async (productId: string): Promise<void> => {
    await axiosInstance.delete(`/wishlist/items/${productId}`)
  },

  checkProduct: async (productId: string): Promise<WishlistCheckResponse> => {
    const { data } = await axiosInstance.get<ApiResponse<WishlistCheckResponse>>(
      `/wishlist/check/${productId}`,
    )
    return requireApiData(data, 'Failed to check wishlist')
  },
}

export default wishlistService
