import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { AdminSearchResult } from '@/types/admin.types'
import type { ApiResponse } from '@/types/api.types'

const adminSearchService = {
  search: async (query: string, limit = 10): Promise<AdminSearchResult> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminSearchResult>>('/admin/search', {
      params: { q: query, limit },
    })
    return requireApiData(data, 'Search failed')
  },
}

export default adminSearchService
