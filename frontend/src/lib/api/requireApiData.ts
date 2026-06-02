import type { ApiResponse } from '@/types/product.types'

export function requireApiData<T>(body: ApiResponse<T>, fallbackMessage: string): T {
  if (!body.success || body.data == null) {
    throw new Error(body.message || fallbackMessage)
  }
  return body.data
}
