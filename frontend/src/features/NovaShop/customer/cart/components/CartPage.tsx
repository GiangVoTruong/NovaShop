import { formatCurrency } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import { PATHS, productDetailPath } from '@/router/paths'
import { Spin, message } from 'antd'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from '../hooks/useCart'
import { ORDER_ITEM_PLACEHOLDER_IMAGE } from '../../orders/lib/orderApi'

function toAmount(value: number | string): number {
  return typeof value === 'number' ? value : Number(value)
}

export default function CartPage() {
  const { t: translate } = useTranslation()
  const cartQuery = useCart()
  const updateItemMutation = useUpdateCartItem()
  const removeItemMutation = useRemoveCartItem()
  const clearCartMutation = useClearCart()

  const cart = cartQuery.data
  const items = cart?.items ?? []
  const itemCount = cart?.itemCount ?? 0
  const totalAmount = toAmount(cart?.totalAmount ?? 0)

  if (cartQuery.isLoading) {
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
          icon={<ShoppingBag className="size-7" />}
          title={translate('cart.empty.title')}
          description={translate('cart.empty.description')}
          action={
            <Link to={PATHS.PRODUCTS}>
              <Button rightIcon={<ArrowRight className="size-4" />} glow>
                {translate('cart.empty.continueShopping')}
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const handleUpdateQuantity = (itemId: string, quantity: number, maxStock: number) => {
    const nextQuantity = Math.max(1, Math.min(maxStock, quantity))
    updateItemMutation.mutate(
      { itemId, request: { quantity: nextQuantity } },
      {
        onError: () => message.error(translate('cart.messages.updateFailed')),
      },
    )
  }

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate(itemId, {
      onError: () => message.error(translate('cart.messages.removeFailed')),
    })
  }

  const handleClearCart = () => {
    clearCartMutation.mutate(undefined, {
      onError: () => message.error(translate('cart.messages.clearFailed')),
    })
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {translate('cart.stepLabel')}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
          {translate('cart.title')}{' '}
          <span className="text-gradient">{translate('cart.titleHighlight')}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {translate('cart.subtitle', { count: itemCount })}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => {
            const unitPrice = toAmount(item.unitPrice)
            const subtotal = toAmount(item.subtotal)
            const imageUrl = item.imageUrl ?? ORDER_ITEM_PLACEHOLDER_IMAGE

            return (
              <article
                key={item.id}
                className="customer-panel flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center sm:p-5"
              >
                <Link
                  to={productDetailPath(item.productId)}
                  className="size-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/80"
                >
                  <img src={imageUrl} alt={item.productName} className="size-full object-cover" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    to={productDetailPath(item.productId)}
                    className="line-clamp-2 text-base font-bold text-slate-900 hover:text-fuchsia-600"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-sm font-extrabold text-gradient">
                    {formatCurrency(unitPrice)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1, item.availableStock)
                        }
                        disabled={updateItemMutation.isPending || item.quantity <= 1}
                        className="grid size-8 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                        aria-label={translate('cart.decrease')}
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1, item.availableStock)
                        }
                        disabled={
                          updateItemMutation.isPending || item.quantity >= item.availableStock
                        }
                        className="grid size-8 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                        aria-label={translate('cart.increase')}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removeItemMutation.isPending}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:underline disabled:opacity-40"
                    >
                      <Trash2 className="size-4" />
                      {translate('cart.remove')}
                    </button>
                  </div>
                </div>

                <p className="text-lg font-extrabold text-gradient sm:text-right">
                  {formatCurrency(subtotal)}
                </p>
              </article>
            )
          })}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to={PATHS.PRODUCTS} className="text-sm font-semibold text-fuchsia-600 hover:underline">
              {translate('cart.continueShopping')}
            </Link>
            <button
              type="button"
              onClick={handleClearCart}
              disabled={clearCartMutation.isPending}
              className="text-sm font-semibold text-slate-500 hover:text-rose-600 disabled:opacity-40"
            >
              {translate('cart.clearAll')}
            </button>
          </div>
        </div>

        <aside className="customer-panel h-fit rounded-3xl p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold text-slate-900">{translate('cart.summary.title')}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{translate('cart.summary.subtotal')}</dt>
              <dd className="font-bold text-slate-900">{formatCurrency(totalAmount)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{translate('cart.summary.shipping')}</dt>
              <dd className="font-bold text-emerald-600">{translate('cart.summary.free')}</dd>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-slate-900">{translate('cart.summary.total')}</dt>
                <dd className="text-xl font-extrabold text-gradient">{formatCurrency(totalAmount)}</dd>
              </div>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">{translate('cart.summary.freeShippingNote')}</p>
          <Link to={PATHS.CHECKOUT} className="mt-6 block">
            <Button fullWidth glow rightIcon={<ArrowRight className="size-4" />}>
              {translate('cart.summary.checkout')}
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  )
}
