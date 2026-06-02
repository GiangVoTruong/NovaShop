import productService from '@/features/NovaShop/customer/catalog/services/productService'
import categoryService from '@/features/NovaShop/customer/catalog/services/categoryService'
import { useQuery } from '@tanstack/react-query'

export const ADMIN_PRODUCTS_QUERY_KEY = ['admin', 'products'] as const
export const ADMIN_CATEGORIES_QUERY_KEY = ['admin', 'categories'] as const

export function useAdminProducts(params?: { keyword?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: [...ADMIN_PRODUCTS_QUERY_KEY, params],
    queryFn: () => productService.listProducts({ ...params, size: params?.size ?? 50 }),
  })
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_QUERY_KEY,
    queryFn: categoryService.listCategories,
  })
}
