import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { AddCartItemRequest, ApiCartResponse, UpdateCartItemRequest } from '@/types/cart.types'
import type { ApiResponse } from '@/types/product.types'

const cartService = {
  getCart: async (): Promise<ApiCartResponse> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiCartResponse>>('/cart')
    return requireApiData(data, 'Failed to load cart')
  },

  addItem: async (request: AddCartItemRequest): Promise<ApiCartResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<ApiCartResponse>>('/cart/items', request)
    return requireApiData(data, 'Failed to add item to cart')
  },

  updateItem: async (itemId: string, request: UpdateCartItemRequest): Promise<ApiCartResponse> => {
    const { data } = await axiosInstance.put<ApiResponse<ApiCartResponse>>(
      `/cart/items/${itemId}`,
      request,
    )
    return requireApiData(data, 'Failed to update cart item')
  },

  removeItem: async (itemId: string): Promise<ApiCartResponse> => {
    const { data } = await axiosInstance.delete<ApiResponse<ApiCartResponse>>(
      `/cart/items/${itemId}`,
    )
    return requireApiData(data, 'Failed to remove cart item')
  },

  clearAllItems: async (): Promise<void> => {
    const cart = await cartService.getCart()
    await Promise.all(cart.items.map((item) => cartService.removeItem(item.id)))
  },
}

export default cartService
