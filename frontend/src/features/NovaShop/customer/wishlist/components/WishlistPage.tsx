import { useQueries } from '@tanstack/react-query'
import { Heart, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Spin } from 'antd'
import { PATHS } from '@/router/paths'
import productService from '../../catalog/services/productService'
import { useShop } from '@/features/NovaShop/shared/store/useShop'
import type { ApiProductResponse } from '@/types/product.types'
import Button from '@/features/NovaShop/shared/ui/Button'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import ProductCard from '../../product/components/ProductCard'

export default function WishlistPage() {
  const { t: translate } = useTranslation()
  const { wishlist } = useShop()

  const productQueries = useQueries({
    queries: wishlist.map((productId) => ({
      queryKey: ['product', productId],
      queryFn: () => productService.getById(productId),
      staleTime: 60_000,
    })),
  })

  const items = productQueries
    .map((query) => query.data)
    .filter((product): product is ApiProductResponse => Boolean(product))

  const isLoading =
    wishlist.length > 0 && productQueries.some((query) => query.isLoading)

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {translate('wishlist.eyebrow')}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {translate('wishlist.title')}{' '}
          <span className="text-gradient">{translate('wishlist.titleHighlight')}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {translate('wishlist.subtitle', { count: items.length })}
        </p>
      </header>

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <Spin size="large" />
        </div>
      ) : items.length === 0 ? (
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
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
