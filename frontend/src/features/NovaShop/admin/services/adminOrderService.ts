import { requireApiData } from '@/lib/api/requireApiData'
import { toPageResult } from '@/lib/api/toPageResult'
import { axiosInstance } from '@/lib/axios/instances'
import type { AdminOrderResponse, AdminOrdersListParams, DeliverOrderRequest, UpdateOrderStatusRequest } from '@/types/admin.types'
import type { ApiResponse, PageResult } from '@/types/api.types'
import type { ApiOrderResponse } from '@/types/order.types'

const adminOrderService = {
  getAllOrders: async (
    params: AdminOrdersListParams = {},
  ): Promise<PageResult<AdminOrderResponse>> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminOrderResponse[]>>('/admin/orders', {
      params,
    })
    return toPageResult(data)
  },

  getById: async (orderId: string): Promise<AdminOrderResponse> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminOrderResponse>>(
      `/admin/orders/${orderId}`,
    )
    return requireApiData(data, 'Failed to load order')
  },

  updateStatus: async (
    orderId: string,
    request: UpdateOrderStatusRequest,
  ): Promise<ApiOrderResponse> => {
    const { data } = await axiosInstance.put<ApiResponse<ApiOrderResponse>>(
      `/orders/${orderId}/status`,
      request,
    )
    return requireApiData(data, 'Failed to update order status')
  },

  deliverOrder: async (
    orderId: string,
    request: DeliverOrderRequest,
  ): Promise<AdminOrderResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<AdminOrderResponse>>(
      `/admin/orders/${orderId}/deliver`,
      request,
    )
    return requireApiData(data, 'Failed to deliver order')
  },
}

export default adminOrderService
