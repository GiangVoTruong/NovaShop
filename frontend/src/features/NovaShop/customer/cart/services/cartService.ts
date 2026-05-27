import { axiosInstance } from '@/lib/axios/instances'
import type { ApiCartResponse } from '@/types/cart.types'
import type { AddCartItemRequest, UpdateCartItemRequest } from '@/types/cart.types'

const cartService = {
  getCart: async (): Promise<ApiCartResponse> => {
    const { data } = await axiosInstance.get<ApiCartResponse>('/cart')
    return data
  },

  addItem: async (request: AddCartItemRequest): Promise<ApiCartResponse> => {
    const { data } = await axiosInstance.post<ApiCartResponse>('/cart/items', request)
    return data
  },

  updateItem: async (
    itemId: string,
    request: UpdateCartItemRequest,
  ): Promise<ApiCartResponse> => {
    const { data } = await axiosInstance.put<ApiCartResponse>(
      `/cart/items/${itemId}`,
      request,
    )
    return data
  },

  removeItem: async (itemId: string): Promise<ApiCartResponse> => {
    const { data } = await axiosInstance.delete<ApiCartResponse>(`/cart/items/${itemId}`)
    return data
  },

  clearAllItems: async (): Promise<void> => {
    const cart = await cartService.getCart()
    await Promise.all(cart.items.map((item) => cartService.removeItem(item.id)))
  },
}

export default cartService
