import { formatCurrency } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import { Heart, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cx } from '@/features/NovaShop/shared/ui/cx'

interface ProductDetailMobileBarProps {
  salePrice: number
  stock: number
  inWishlist: boolean
  wishlistPending: boolean
  cartPending: boolean
  buyNowPending?: boolean
  onAddToCart: () => void
  onBuyNow: () => void
  onToggleWishlist: () => void
}

export default function ProductDetailMobileBar({
  salePrice,
  stock,
  inWishlist,
  wishlistPending,
  cartPending,
  buyNowPending = false,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
}: ProductDetailMobileBarProps) {
  const { t: translate } = useTranslation()
  const outOfStock = stock <= 0

  return (
    <div className="fixed inset-x-0 bottom-21 z-30 border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 shrink">
          <p className="text-lg font-extrabold tracking-tight text-gradient">
            {formatCurrency(salePrice)}
          </p>
        </div>

        <button
          type="button"
          className={cx(
            'grid size-11 shrink-0 place-items-center rounded-2xl border-2 transition-colors',
            inWishlist
              ? 'border-rose-200 bg-rose-50 text-rose-500'
              : 'border-slate-200 bg-white text-slate-600',
          )}
          disabled={wishlistPending}
          onClick={onToggleWishlist}
          aria-label={translate('product.detail.wishlist')}
        >
          <Heart className={cx('size-5', inWishlist && 'fill-current')} />
        </button>

        <Button
          size="md"
          glow
          className="min-w-0 flex-1"
          loading={cartPending}
          disabled={outOfStock}
          leftIcon={<ShoppingBag className="size-4" />}
          onClick={onAddToCart}
        >
          {translate('product.detail.addToCart')}
        </Button>

        <Button
          size="md"
          variant="dark"
          className="shrink-0 px-4"
          loading={buyNowPending}
          disabled={outOfStock || cartPending}
          onClick={onBuyNow}
        >
          {translate('product.detail.buyNow')}
        </Button>
      </div>
    </div>
  )
}
