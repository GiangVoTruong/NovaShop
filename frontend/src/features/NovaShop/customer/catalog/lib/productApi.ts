import type { CategorySlug } from '@/features/NovaShop/shared/types'
import type { ApiProductResponse } from '@/types/product.types'
import { normalizeCategorySlug } from './categoryApi'

export const PRODUCT_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'

export function toProductNumber(value: number | string | null | undefined): number {
  if (value == null) return 0
  return typeof value === 'number' ? value : Number(value)
}

export function getProductImages(product: ApiProductResponse): string[] {
  if (product.imageUrls.length > 0) return product.imageUrls
  if (product.primaryImageUrl) return [product.primaryImageUrl]
  return [PRODUCT_PLACEHOLDER_IMAGE]
}

export function getProductListPrice(product: ApiProductResponse): number {
  return toProductNumber(product.price)
}

export function getProductSalePrice(product: ApiProductResponse): number {
  return toProductNumber(product.discountPrice ?? product.price)
}

export function hasProductDiscount(product: ApiProductResponse): boolean {
  const listPrice = getProductListPrice(product)
  const salePrice = getProductSalePrice(product)
  return product.discountPrice != null && salePrice < listPrice
}

export function getProductDiscountPercent(product: ApiProductResponse): number {
  if (!hasProductDiscount(product)) return 0
  const listPrice = getProductListPrice(product)
  const salePrice = getProductSalePrice(product)
  return Math.round(((listPrice - salePrice) / listPrice) * 100)
}

export function isProductOutOfStock(product: ApiProductResponse): boolean {
  return product.status === 'DELETED' || (product.stock ?? 0) <= 0
}

export function isProductHot(product: ApiProductResponse): boolean {
  return (product.soldCount ?? 0) > 50
}

export function getProductCategorySlug(
  product: ApiProductResponse,
  categorySlugById?: Map<string, string>,
): CategorySlug {
  const slug = categorySlugById?.get(product.categoryId)
  return normalizeCategorySlug(slug ?? product.categoryName.toLowerCase())
}

export function getProductRating(product: ApiProductResponse): number {
  return toProductNumber(product.avgRating)
}
