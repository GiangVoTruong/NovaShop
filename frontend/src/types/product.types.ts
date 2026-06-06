import type { ListQueryParams } from '@/types/api.types'

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

export type ProductListParams = ListQueryParams & {
  keyword?: string
  category?: string
  mode?: string
  sellerId?: string
  sortKey?: string
}
