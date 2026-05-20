import { productDetailPath } from '@/router/paths'
import { Heart, ShoppingCart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../../shared/format'
import { useShop } from '../../../shared/store/useShop'
import type { Product } from '../../../shared/types'
import StarRating from '../../../shared/ui/StarRating'
import { CategoryTag } from '../../../shared/ui/StatusBadge'
import { CATEGORY_GLOW } from '../../../shared/ui/categoryTokens'
import { cx } from '../../../shared/ui/cx'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWished } = useShop()
  const wished = isWished(product.id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  const isNew = product.tags?.includes('New') || product.tags?.includes('Hot')

  return (
    <article
      className={cx(
        'group/card relative flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/85 backdrop-blur-xl transition-all duration-500',
        'hover:-translate-y-1.5',
        CATEGORY_GLOW[product.category],
      )}
    >
      <Link
        to={productDetailPath(product.id)}
        className="relative block aspect-4/5 overflow-hidden bg-slate-100"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover/card:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-pink-500/40">
              -{discount}%
            </span>
          )}
          {isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-orange-500/40">
              <Sparkles className="size-3" /> HOT
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              Hết hàng
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            toggleWishlist(product.id)
          }}
          aria-label={wished ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          className={cx(
            'absolute right-3 top-3 grid size-10 place-items-center rounded-full backdrop-blur-md transition-all duration-300',
            wished
              ? 'bg-linear-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-pink-500/40'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:scale-110',
          )}
        >
          <Heart className={cx('size-4', wished && 'fill-white')} />
        </button>

        {/* Bottom quick add button (revealed on hover) */}
        <button
          type="button"
          disabled={product.stock === 0}
          onClick={(event) => {
            event.preventDefault()
            addToCart(product.id)
          }}
          className="absolute inset-x-3 bottom-3 flex h-11 translate-y-16 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-sm font-semibold text-white opacity-0 shadow-[0_10px_30px_-5px_rgba(217,70,239,0.6)] transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="size-4" />
          Thêm vào giỏ
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <CategoryTag category={product.category} />
          <span className="text-xs font-medium text-slate-400">{product.brand}</span>
        </div>

        <Link
          to={productDetailPath(product.id)}
          className="line-clamp-2 text-[15px] font-bold tracking-tight text-slate-900 transition-colors hover:text-fuchsia-600"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2">
          <StarRating value={product.rating} size={14} />
          <span className="text-xs text-slate-500">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-xl font-extrabold tracking-tight text-gradient">
              {formatCurrency(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
