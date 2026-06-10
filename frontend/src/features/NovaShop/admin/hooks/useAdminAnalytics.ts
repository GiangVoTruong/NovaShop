import { useQuery } from '@tanstack/react-query'
import adminAnalyticsService from '../services/adminAnalyticsService'

export const ADMIN_ANALYTICS_QUERY_KEY = ['admin', 'analytics'] as const

export function useAdminAnalytics(params?: { fromDate?: string; toDate?: string }) {
  return useQuery({
    queryKey: [...ADMIN_ANALYTICS_QUERY_KEY, params],
    queryFn: () => adminAnalyticsService.getOverview(params),
  })
}

export function useAdminAnalyticsSummary() {
  return useQuery({
    queryKey: [...ADMIN_ANALYTICS_QUERY_KEY, 'summary'],
    queryFn: adminAnalyticsService.getSummary,
    staleTime: 60_000,
  })
}
