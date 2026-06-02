import ProductCard from '@/features/NovaShop/customer/product/components/ProductCard'
import { useRemoveFromWishlist, useWishlist } from '@/features/NovaShop/customer/wishlist/hooks/useWishlist'
import Button from '@/features/NovaShop/shared/ui/Button'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import { PATHS } from '@/router/paths'
import { Spin } from 'antd'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function WishlistPage() {
  const { t: translate } = useTranslation()
  const wishlistQuery = useWishlist()
  const removeMutation = useRemoveFromWishlist()
  const items = wishlistQuery.data ?? []

  if (wishlistQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={<Heart className="size-7" />}
          title={translate('wishlist.empty.title')}
          description={translate('wishlist.empty.description')}
          action={
            <Link to={PATHS.PRODUCTS}>
              <Button leftIcon={<ShoppingBag className="size-4" />} glow>
                {translate('wishlist.empty.explore')}
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {translate('wishlist.eyebrow')}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
          {translate('wishlist.title')}{' '}
          <span className="text-gradient">{translate('wishlist.titleHighlight')}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {translate('wishlist.subtitle', { count: items.length })}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <ProductCard product={item.product} />
            <button
              type="button"
              aria-label={translate('wishlist.remove')}
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-rose-500 shadow-md backdrop-blur hover:bg-white"
              onClick={() => removeMutation.mutate(item.productId)}
              disabled={removeMutation.isPending}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
