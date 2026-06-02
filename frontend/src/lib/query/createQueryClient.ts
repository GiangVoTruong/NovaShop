import { QueryClient } from '@tanstack/react-query'
import { isRetryableApiError } from '@/lib/axios/apiError'

const MAX_QUERY_RETRIES = 2

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) =>
          isRetryableApiError(error) && failureCount < MAX_QUERY_RETRIES,
        retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 15_000),
      },
    },
  })
}
