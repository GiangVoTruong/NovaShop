import { requireApiData } from '@/lib/api/requireApiData'
import { toPageResult } from '@/lib/api/toPageResult'
import { axiosInstance } from '@/lib/axios/instances'
import type {
  AdminInventoryItem,
  AdminInventoryListParams,
  AdminInventorySummary,
} from '@/types/admin.types'
import type { ApiResponse, PageResult } from '@/types/api.types'

const adminInventoryService = {
  listInventory: async (
    params: AdminInventoryListParams = {},
  ): Promise<PageResult<AdminInventoryItem>> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminInventoryItem[]>>('/admin/inventory', {
      params,
    })
    return toPageResult(data)
  },

  getSummary: async (): Promise<AdminInventorySummary> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminInventorySummary>>(
      '/admin/inventory/summary',
    )
    return requireApiData(data, 'Failed to load inventory summary')
  },
}

export default adminInventoryService
