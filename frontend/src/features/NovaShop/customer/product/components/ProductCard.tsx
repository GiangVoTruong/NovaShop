import { productDetailPath } from '@/router/paths'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useCategorySlugMap } from '../../catalog/hooks/useCategorySlugMap'
import {
  getProductCategorySlug,
  getProductDiscountPercent,
  getProductImages,
  getProductListPrice,
  getProductRating,
  getProductSalePrice,
  isProductHot,
  isProductOutOfStock,
} from '../../catalog/lib/productApi'
import { formatCurrency } from '@/features/NovaShop/shared/format'
import type { ApiProductResponse } from '@/types/product.types'
import StarRating from '@/features/NovaShop/shared/ui/StarRating'
import { CategoryTag } from '@/features/NovaShop/shared/ui/StatusBadge'
interface ProductCardProps {
  product: ApiProductResponse
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t: translate } = useTranslation()
  const categorySlugById = useCategorySlugMap()

  const discount = getProductDiscountPercent(product)
  const isHot = isProductHot(product)
  const outOfStock = isProductOutOfStock(product)
  const images = getProductImages(product)
  const salePrice = getProductSalePrice(product)
  const listPrice = getProductListPrice(product)
  const categorySlug = getProductCategorySlug(product, categorySlugById)

  return (
    <article className="customer-card group/card relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl">
      <Link
        to={productDetailPath(product.id)}
        className="relative block aspect-square overflow-hidden bg-slate-100 sm:aspect-4/5"
      >
        <img
          src={images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover/card:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

        <div className="absolute left-2 top-2 flex flex-col gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md sm:px-2.5 sm:py-1 sm:text-[11px]">
              -{discount}%
            </span>
          )}
          {isHot && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px]">
              <Sparkles className="size-2.5 sm:size-3" /> {translate('product.card.hot')}
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-slate-900/90 px-2.5 py-1 text-[11px] font-bold text-white">
              {translate('product.card.outOfStock')}
            </span>
          )}
        </div>

      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-4">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <CategoryTag category={categorySlug} />
          <span className="hidden truncate text-xs font-medium text-slate-400 sm:inline">
            {product.sellerName}
          </span>
        </div>

        <Link
          to={productDetailPath(product.id)}
          className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-slate-900 transition-colors hover:text-fuchsia-600 sm:text-[15px]"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <StarRating value={getProductRating(product)} size={12} className="sm:hidden" />
          <StarRating value={getProductRating(product)} size={14} className="hidden sm:flex" />
          <span className="text-[11px] text-slate-500 sm:text-xs">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-0.5 sm:pt-1">
          <div>
            <p className="text-base font-extrabold tracking-tight text-gradient sm:text-xl">
              {formatCurrency(salePrice)}
            </p>
            {discount > 0 && (
              <p className="text-xs text-slate-400 line-through">
                {formatCurrency(listPrice)}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
