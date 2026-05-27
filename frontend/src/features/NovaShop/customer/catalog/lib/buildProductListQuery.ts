import type { ProductListParams } from '@/types/product.types'

export type ProductListQuery = {
  keyword?: string
  category?: string
  mode?: string
  page: number
  size: number
  sortBy?: string
  sortDir?: string
}

function buildSortParams(sortKey?: string): { sortBy?: string; sortDir?: string } {
  switch (sortKey) {
    case 'newest':
      return { sortBy: 'createdAt', sortDir: 'desc' }
    case 'price-asc':
      return { sortBy: 'price', sortDir: 'asc' }
    case 'price-desc':
      return { sortBy: 'price', sortDir: 'desc' }
    case 'rating':
      return { sortBy: 'avgRating', sortDir: 'desc' }
    case 'popular':
      return { sortBy: 'reviewCount', sortDir: 'desc' }
    default:
      return { sortBy: 'createdAt', sortDir: 'desc' }
  }
}

export function buildProductListQuery(params: ProductListParams = {}): ProductListQuery {
  const sort = buildSortParams(params.sortBy ?? params.sortKey)

  return {
    keyword: params.keyword || undefined,
    category: params.category || undefined,
    mode: params.mode || undefined,
    page: params.page ?? 0,
    size: params.size ?? 20,
    sortBy: params.sortBy ?? sort.sortBy,
    sortDir: params.sortDir ?? sort.sortDir,
  }
}
