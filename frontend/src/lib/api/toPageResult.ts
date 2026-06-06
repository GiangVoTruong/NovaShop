import type { ApiResponse, PageResult } from '@/types/api.types'

export function toPageResult<T>(response: ApiResponse<T[]>): PageResult<T> {
  return {
    data: response.data ?? [],
    total: response.meta?.total ?? 0,
    page: response.meta?.page ?? 1,
    limit: response.meta?.limit ?? 20,
  }
}
