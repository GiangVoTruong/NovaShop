import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { ApiOrderResponse, CheckoutRequest } from '@/types/order.types'
import type { ApiResponse } from '@/types/api.types'

const orderService = {
  checkout: async (request: CheckoutRequest): Promise<ApiOrderResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<ApiOrderResponse>>(
      '/orders/checkout',
      request,
    )
    return requireApiData(data, 'Checkout failed')
  },

  getMyOrders: async (): Promise<ApiOrderResponse[]> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiOrderResponse[]>>('/orders')
    return requireApiData(data, 'Failed to load orders') ?? []
  },

  getById: async (orderId: string): Promise<ApiOrderResponse> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiOrderResponse>>(`/orders/${orderId}`)
    return requireApiData(data, 'Failed to load order')
  },

  cancelOrder: async (orderId: string): Promise<ApiOrderResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<ApiOrderResponse>>(
      `/orders/${orderId}/cancel`,
    )
    return requireApiData(data, 'Failed to cancel order')
  },

  confirmReceived: async (orderId: string): Promise<ApiOrderResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<ApiOrderResponse>>(
      `/orders/${orderId}/confirm-received`,
    )
    return requireApiData(data, 'Failed to confirm order received')
  },
}

export default orderService
