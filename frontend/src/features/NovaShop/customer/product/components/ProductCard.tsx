import { useMemo } from 'react'
import { productDetailPath } from '@/router/paths'
import { Heart, ShoppingCart, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useCategories } from '../../catalog/hooks/useCategories'
import {
  buildCategorySlugMap,
} from '../../catalog/lib/categoryApi'
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
import { useShop } from '@/features/NovaShop/shared/store/useShop'
import type { ApiProductResponse } from '@/types/product.types'
import StarRating from '@/features/NovaShop/shared/ui/StarRating'
import { CategoryTag } from '@/features/NovaShop/shared/ui/StatusBadge'
import { cx } from '@/features/NovaShop/shared/ui/cx'

interface ProductCardProps {
  product: ApiProductResponse
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t: translate } = useTranslation()
  const { addToCart, toggleWishlist, isWished } = useShop()
  const categoriesQuery = useCategories()
  const categorySlugById = useMemo(
    () => buildCategorySlugMap(categoriesQuery.data ?? []),
    [categoriesQuery.data],
  )

  const wished = isWished(product.id)
  const discount = getProductDiscountPercent(product)
  const isHot = isProductHot(product)
  const outOfStock = isProductOutOfStock(product)
  const images = getProductImages(product)
  const salePrice = getProductSalePrice(product)
  const listPrice = getProductListPrice(product)
  const categorySlug = getProductCategorySlug(product, categorySlugById)

  return (
    <article
      className={cx(
        'customer-card group/card relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300',
        'hover:-translate-y-1.5',
      )}
    >
      <Link
        to={productDetailPath(product.id)}
        className="relative block aspect-4/5 overflow-hidden bg-slate-100"
      >
        <img
          src={images[0]}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
              -{discount}%
            </span>
          )}
          {isHot && (
            <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
              <Sparkles className="size-3" /> {translate('product.card.hot')}
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
              {translate('product.card.outOfStock')}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            toggleWishlist(product.id)
          }}
          aria-label={
            wished ? translate('product.card.removeFromWishlist') : translate('product.card.addToWishlist')
          }
          className={cx(
            'absolute right-3 top-3 grid size-10 place-items-center rounded-full transition-all duration-200',
            wished
              ? 'bg-linear-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-pink-500/35'
              : 'bg-white/90 text-slate-700 hover:scale-105 hover:bg-white',
          )}
        >
          <Heart className={cx('size-4', wished && 'fill-white')} />
        </button>

        <button
          type="button"
          disabled={outOfStock}
          onClick={(event) => {
            event.preventDefault()
            addToCart(product.id)
          }}
          className="absolute inset-x-3 bottom-3 flex h-11 translate-y-14 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-sm font-semibold text-white opacity-0 shadow-[0_10px_30px_-5px_rgba(217,70,239,0.55)] transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="size-4" />
          {translate('product.card.addToCart')}
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <CategoryTag category={categorySlug} />
          <span className="text-xs font-medium text-slate-400">{product.sellerName}</span>
        </div>

        <Link
          to={productDetailPath(product.id)}
          className="line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-slate-900 transition-colors hover:text-fuchsia-600"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2">
          <StarRating value={getProductRating(product)} size={14} />
          <span className="text-xs text-slate-500">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-xl font-extrabold tracking-tight text-gradient">
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
