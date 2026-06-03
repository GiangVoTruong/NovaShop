import {
  getProductRating,
  getProductSalePrice,
  isProductOutOfStock,
} from '../../catalog/lib/productApi'
import type { ApiProductResponse } from '@/types/product.types'

export const PRODUCT_PRICE_MIN = 0
export const PRODUCT_PRICE_MAX = 10_000_000
export const PRODUCT_CLIENT_FILTER_FETCH_SIZE = 120

export type ProductListFilters = {
  sellerId: string | null
  minPrice: number
  maxPrice: number
  minRating: number | null
  inStockOnly: boolean
}

export type BrandOption = {
  sellerId: string
  sellerName: string
}

function parsePriceParam(
  rawValue: string | null,
  fallback: number,
): number {
  if (rawValue === null || rawValue.trim() === '') {
    return fallback
  }
  const parsed = Number(rawValue)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function normalizePriceRange(
  minPrice: number,
  maxPrice: number,
): { minPrice: number; maxPrice: number } {
  const clampedMin = Math.max(
    PRODUCT_PRICE_MIN,
    Math.min(minPrice, PRODUCT_PRICE_MAX),
  )
  const clampedMax = Math.max(
    PRODUCT_PRICE_MIN,
    Math.min(maxPrice, PRODUCT_PRICE_MAX),
  )

  if (clampedMin <= clampedMax) {
    return { minPrice: clampedMin, maxPrice: clampedMax }
  }

  return { minPrice: clampedMax, maxPrice: clampedMin }
}

export function parseProductListFilters(searchParams: URLSearchParams): ProductListFilters {
  const ratingRaw = searchParams.get('rating')
  const { minPrice, maxPrice } = normalizePriceRange(
    parsePriceParam(searchParams.get('minPrice'), PRODUCT_PRICE_MIN),
    parsePriceParam(searchParams.get('maxPrice'), PRODUCT_PRICE_MAX),
  )

  return {
    sellerId: searchParams.get('seller'),
    minPrice,
    maxPrice,
    minRating:
      ratingRaw === null || ratingRaw === '' || ratingRaw === '0'
        ? null
        : Number(ratingRaw),
    inStockOnly: searchParams.get('stock') === '1',
  }
}

export function hasClientOnlyFilters(filters: ProductListFilters): boolean {
  const hasPriceFilter =
    filters.minPrice > PRODUCT_PRICE_MIN || filters.maxPrice < PRODUCT_PRICE_MAX
  const hasRatingFilter = filters.minRating != null && filters.minRating > 0
  return hasPriceFilter || hasRatingFilter || filters.inStockOnly
}

export function buildProductListingKey(
  mode: string,
  categoryParam: string | null,
  keywordParam: string,
  filters: ProductListFilters,
): string {
  return [
    mode,
    categoryParam ?? '',
    keywordParam,
    filters.sellerId ?? '',
    filters.minPrice,
    filters.maxPrice,
    filters.minRating ?? '',
    filters.inStockOnly ? '1' : '0',
  ].join(':')
}

export function filterProductsByClientCriteria(
  products: ApiProductResponse[],
  filters: ProductListFilters,
): ApiProductResponse[] {
  return products.filter((product) => {
    const salePrice = getProductSalePrice(product)
    if (salePrice < filters.minPrice || salePrice > filters.maxPrice) {
      return false
    }

    if (filters.minRating != null && filters.minRating > 0) {
      const rating = getProductRating(product)
      if (rating < filters.minRating) {
        return false
      }
    }

    if (filters.inStockOnly && isProductOutOfStock(product)) {
      return false
    }

    return true
  })
}

export function extractBrandOptions(products: ApiProductResponse[]): BrandOption[] {
  const brandBySellerId = new Map<string, string>()
  for (const product of products) {
    brandBySellerId.set(product.sellerId, product.sellerName)
  }

  return Array.from(brandBySellerId, ([sellerId, sellerName]) => ({
    sellerId,
    sellerName,
  })).sort((left, right) => left.sellerName.localeCompare(right.sellerName))
}
