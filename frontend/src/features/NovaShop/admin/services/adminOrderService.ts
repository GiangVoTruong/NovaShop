import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type {
  AdminOrderResponse,
  AdminOrdersListParams,
  AdminOrdersPageResult,
  UpdateOrderStatusRequest,
} from '@/types/admin.types'
import type { ApiOrderResponse } from '@/types/order.types'
import type { ApiResponse } from '@/types/product.types'

function toAdminOrdersPageResult(
  response: ApiResponse<AdminOrderResponse[]>,
): AdminOrdersPageResult {
  return {
    data: response.data ?? [],
    total: response.meta?.total ?? 0,
    page: response.meta?.page ?? 1,
    limit: response.meta?.limit ?? 20,
  }
}

const adminOrderService = {
  getAllOrders: async (params: AdminOrdersListParams = {}): Promise<AdminOrdersPageResult> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminOrderResponse[]>>('/admin/orders', {
      params,
    })
    return toAdminOrdersPageResult(data)
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
}

export default adminOrderService
