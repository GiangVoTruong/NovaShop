/** Body lỗi từ backend — {@link com.backend.exception.ErrorResponse} */
export type ApiErrorBody = {
  status: number
  message: string
  timestamp: string
}

export type ApiPageMeta = {
  page: number
  limit: number
  total: number
}

export type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: ApiPageMeta
}

export type PageResult<T> = ApiPageMeta & {
  data: T[]
}

export type ListQueryParams = {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}
