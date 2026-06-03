export type ApiProductStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED'

export type ApiProductResponse = {
  id: string
  sellerId: string
  sellerName: string
  categoryId: string
  categoryName: string
  name: string
  slug: string
  description: string
  price: number
  discountPrice: number | null
  stock: number
  soldCount: number
  avgRating: number | null
  reviewCount: number
  status: ApiProductStatus
  imageUrls: string[]
  primaryImageUrl: string | null
  createdAt: string
  updatedAt: string
}

export type ApiCategoryResponse = {
  id: string
  name: string
  slug: string
  parentId: string | null
  imageUrl: string | null
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

export type ProductListParams = {
  keyword?: string
  category?: string
  mode?: string
  sellerId?: string
  page?: number
  size?: number
  sortKey?: string
  sortBy?: string
  sortDir?: string
}

export type ProductsPageResult = {
  data: ApiProductResponse[]
  total: number
  page: number
  limit: number
}
