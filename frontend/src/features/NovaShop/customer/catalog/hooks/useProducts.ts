import type { PageResult } from '@/types/api.types'
import type { ApiProductResponse, ProductListParams } from '@/types/product.types'
import { useQuery } from '@tanstack/react-query'
import productService from '../services/productService'

export type UseProductsParams = ProductListParams & {
  enabled?: boolean
}

export function useProducts({
  enabled = true,
  page = 0,
  size = 20,
  ...listParams
}: UseProductsParams = {}) {
  const params: ProductListParams = { ...listParams, page, size }

  return useQuery<PageResult<ApiProductResponse>>({
    queryKey: ['products', params],
    queryFn: () => productService.listProducts(params),
    enabled,
  })
}

export function useProductById(productId: string | undefined) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getById(productId!),
    enabled: Boolean(productId),
  })
}
