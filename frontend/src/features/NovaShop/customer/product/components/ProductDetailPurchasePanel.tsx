import { formatCurrency } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import StarRating from '@/features/NovaShop/shared/ui/StarRating'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import type { ApiProductResponse } from '@/types/product.types'
import {
  CheckCircle2,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  Store,
  Truck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getProductRating } from '../../catalog/lib/productApi'

const PERKS = [
  {
    icon: Truck,
    labelKey: 'product.detail.perks.delivery.label',
    valueKey: 'product.detail.perks.delivery.value',
    grad: 'from-cyan-400 to-blue-500',
  },
  {
    icon: ShieldCheck,
    labelKey: 'product.detail.perks.warranty.label',
    valueKey: 'product.detail.perks.warranty.value',
    grad: 'from-emerald-400 to-teal-500',
  },
  {
    icon: RotateCcw,
    labelKey: 'product.detail.perks.returns.label',
    valueKey: 'product.detail.perks.returns.value',
    grad: 'from-fuchsia-500 to-pink-500',
  },
] as const

interface ProductDetailPurchasePanelProps {
  product: ApiProductResponse
  salePrice: number
  listPrice: number
  discount: number
  stock: number
  quantity: number
  inWishlist: boolean
  wishlistPending: boolean
  cartPending: boolean
  onDecreaseQuantity: () => void
  onIncreaseQuantity: () => void
  onAddToCart: () => void
  onBuyNow: () => void
  onToggleWishlist: () => void
  className?: string
}

export default function ProductDetailPurchasePanel({
  product,
  salePrice,
  listPrice,
  discount,
  stock,
  quantity,
  inWishlist,
  wishlistPending,
  cartPending,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  className,
}: ProductDetailPurchasePanelProps) {
  const { t: translate } = useTranslation()
  const outOfStock = stock <= 0
  const soldLabel =
    product.soldCount >= 1000
      ? translate('product.detail.soldCount', {
          count: `${(product.soldCount / 1000).toFixed(1)}K`,
        })
      : translate('product.detail.soldCount', { count: product.soldCount.toLocaleString() })

  return (
    <div className={cx('space-y-6', className)}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
            <Package className="size-3.5" />
            {product.categoryName}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
            <Store className="size-3.5" />
            {product.sellerName}
          </span>
        </div>

        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <StarRating value={getProductRating(product)} size={16} showValue />
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">
            {translate('product.detail.reviews', {
              count: product.reviewCount.toLocaleString(),
            })}
          </span>
          {product.soldCount > 0 && (
            <>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                <CheckCircle2 className="size-3.5" />
                {soldLabel}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-fuchsia-50 via-purple-50/80 to-cyan-50 p-5 ring-1 ring-fuchsia-100/80">
        <div className="absolute -right-8 -top-8 size-28 rounded-full bg-fuchsia-300/25 blur-2xl" />
        <div className="relative flex flex-wrap items-end gap-3">
          <span className="text-3xl font-extrabold tracking-tight text-gradient sm:text-4xl">
            {formatCurrency(salePrice)}
          </span>
          {discount > 0 && (
            <>
              <span className="pb-1 text-base text-slate-400 line-through">
                {formatCurrency(listPrice)}
              </span>
              <span className="mb-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-600">
                -{discount}%
              </span>
            </>
          )}
        </div>
        {discount > 0 && (
          <p className="relative mt-1.5 text-xs text-slate-500">
            {translate('product.detail.priceNote')}{' '}
            <span className="font-semibold text-emerald-600">
              {formatCurrency(listPrice - salePrice)}
            </span>
          </p>
        )}
      </div>

      {product.description && (
        <p className="text-sm leading-relaxed text-slate-600 sm:text-[15px]">{product.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-4 border-y border-slate-100 py-5">
        <span className="text-sm font-semibold text-slate-900">
          {translate('product.detail.quantity')}
        </span>
        <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={onDecreaseQuantity}
            disabled={quantity <= 1}
            className="grid size-9 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
            aria-label={translate('product.detail.decrease')}
          >
            <Minus className="size-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={onIncreaseQuantity}
            disabled={quantity >= stock}
            className="grid size-9 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
            aria-label={translate('product.detail.increase')}
          >
            <Plus className="size-4" />
          </button>
        </div>
        <span
          className={cx(
            'text-xs font-medium',
            outOfStock ? 'text-rose-500' : 'text-slate-500',
          )}
        >
          {outOfStock
            ? translate('product.card.outOfStock')
            : translate('product.detail.stockLeft', { count: stock })}
        </span>
      </div>

      <div className="hidden flex-col gap-3 lg:flex">
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="lg"
            glow
            fullWidth
            loading={cartPending}
            disabled={outOfStock}
            onClick={onAddToCart}
          >
            {translate('product.detail.addToCart')}
          </Button>
          <Button
            size="lg"
            variant="dark"
            fullWidth
            loading={cartPending}
            disabled={outOfStock}
            onClick={onBuyNow}
          >
            {translate('product.detail.buyNow')}
          </Button>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className={cx(
              'flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-semibold transition-colors',
              inWishlist
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
            )}
            disabled={wishlistPending}
            onClick={onToggleWishlist}
          >
            <Heart className={cx('size-4', inWishlist && 'fill-current')} />
            {translate('product.detail.wishlist')}
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300"
            aria-label={translate('product.detail.share')}
          >
            <Share2 className="size-4" />
            {translate('product.detail.share')}
          </button>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        {PERKS.map((entry) => (
          <div
            key={entry.labelKey}
            className="flex items-center gap-3 rounded-2xl bg-slate-50/80 p-3 ring-1 ring-slate-100"
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br ${entry.grad} text-white shadow-sm`}
            >
              <entry.icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500">{translate(entry.labelKey)}</p>
              <p className="truncate text-xs font-bold text-slate-900">{translate(entry.valueKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
