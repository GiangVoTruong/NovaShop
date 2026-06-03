import { useQuery } from '@tanstack/react-query'
import productService from '../../catalog/services/productService'
import { extractBrandOptions, type BrandOption } from '../lib/productListFilters'

const BRAND_OPTIONS_QUERY_KEY = ['products', 'brand-options'] as const

export function useProductBrandOptions(): BrandOption[] {
  const brandOptionsQuery = useQuery({
    queryKey: BRAND_OPTIONS_QUERY_KEY,
    queryFn: () => productService.listProducts({ page: 0, size: 60, sortKey: 'popular' }),
    staleTime: 10 * 60_000,
    select: (result) => extractBrandOptions(result.data),
  })

  return brandOptionsQuery.data ?? []
}
