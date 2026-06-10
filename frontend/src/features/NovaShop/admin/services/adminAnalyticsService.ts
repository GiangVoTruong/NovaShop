import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { AdminAnalyticsOverview, AdminAnalyticsSummary } from '@/types/admin.types'
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

  getSummary: async (): Promise<AdminAnalyticsSummary> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminAnalyticsSummary>>(
      '/admin/analytics/summary',
    )
    return requireApiData(data, 'Failed to load analytics summary')
  },
}

export default adminAnalyticsService
