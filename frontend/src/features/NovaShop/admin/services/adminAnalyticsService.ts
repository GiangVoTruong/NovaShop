import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { AdminAnalyticsOverview } from '@/types/admin.types'
import type { ApiResponse } from '@/types/api.types'

const adminAnalyticsService = {
  getOverview: async (params?: {
    fromDate?: string
    toDate?: string
  }): Promise<AdminAnalyticsOverview> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminAnalyticsOverview>>(
      '/admin/analytics/overview',
      { params },
    )
    return requireApiData(data, 'Failed to load analytics')
  },
}

export default adminAnalyticsService
