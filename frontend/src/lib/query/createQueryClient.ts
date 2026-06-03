import { QueryClient } from '@tanstack/react-query'
import { isRetryableApiError } from '@/lib/axios/apiError'
import {
  DEFAULT_QUERY_GC_TIME_MS,
  DEFAULT_QUERY_STALE_TIME_MS,
} from '@/lib/query/queryConfig'

const MAX_QUERY_RETRIES = 2

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_QUERY_STALE_TIME_MS,
        gcTime: DEFAULT_QUERY_GC_TIME_MS,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error) =>
          isRetryableApiError(error) && failureCount < MAX_QUERY_RETRIES,
        retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 15_000),
      },
    },
  })
}
