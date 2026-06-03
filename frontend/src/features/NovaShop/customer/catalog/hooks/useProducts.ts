import { useQuery } from '@tanstack/react-query'
import type { ProductsPageResult } from '@/types/product.types'
import productService from '../services/productService'

export type UseProductsParams = {
  keyword?: string
  category?: string
  mode?: string
  sellerId?: string
  page?: number
  size?: number
  sortKey?: string
  sortBy?: string
  sortDir?: string
  enabled?: boolean
}

export function useProducts(params: UseProductsParams = {}) {
  const {
    keyword,
    category,
    mode,
    sellerId,
    page = 0,
    size = 20,
    sortKey,
    sortBy,
    sortDir,
    enabled = true,
  } = params

  return useQuery<ProductsPageResult>({
    queryKey: ['products', keyword, category, mode, sellerId, page, size, sortKey, sortBy, sortDir],
    queryFn: () =>
      productService.listProducts({
        keyword,
        category,
        mode,
        sellerId,
        page,
        size,
        sortKey,
        sortBy,
        sortDir,
      }),
    enabled,
  })
}

export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getById(productId!),
    enabled: Boolean(productId),
  })
}
