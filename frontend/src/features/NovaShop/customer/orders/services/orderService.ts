import { axiosInstance } from '@/lib/axios/instances'
import type { ApiOrderResponse, CheckoutRequest } from '@/types/order.types'

const orderService = {
  checkout: async (request: CheckoutRequest): Promise<ApiOrderResponse> => {
    const { data } = await axiosInstance.post<ApiOrderResponse>('/orders/checkout', request)
    return data
  },

  getMyOrders: async (): Promise<ApiOrderResponse[]> => {
    const { data } = await axiosInstance.get<ApiOrderResponse[]>('/orders')
    return data
  },

  getById: async (orderId: string): Promise<ApiOrderResponse> => {
    const { data } = await axiosInstance.get<ApiOrderResponse>(`/orders/${orderId}`)
    return data
  },

  cancelOrder: async (orderId: string): Promise<ApiOrderResponse> => {
    const { data } = await axiosInstance.post<ApiOrderResponse>(`/orders/${orderId}/cancel`)
    return data
  },
}

export default orderService
