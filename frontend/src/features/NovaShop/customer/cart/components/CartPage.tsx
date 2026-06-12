import { formatCurrency } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import { PATHS, productDetailPath } from '@/router/paths'
import { Checkbox, Spin, message } from 'antd'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CouponInputSection from '../../checkout/components/CouponInputSection'
import { useCheckoutCoupon } from '../../checkout/hooks/useCheckoutCoupon'
import {
  clearPartialCheckoutSession,
  startPartialCheckoutSession,
} from '../lib/partialCheckoutSession'
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
  const navigate = useNavigate()
  const cartQuery = useCart()
  const updateItemMutation = useUpdateCartItem()
  const removeItemMutation = useRemoveCartItem()
  const clearCartMutation = useClearCart()
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(() => new Set())

  const cart = cartQuery.data
  const items = cart?.items ?? []
  const itemIdsKey = useMemo(() => items.map((item) => item.id).join('|'), [items])

  useEffect(() => {
    setSelectedItemIds((previous) => {
      if (previous.size === 0) {
        return new Set(items.map((item) => item.id))
      }

      const next = new Set<string>()
      for (const item of items) {
        if (previous.has(item.id)) {
          next.add(item.id)
        }
      }
      for (const item of items) {
        if (!previous.has(item.id)) {
          next.add(item.id)
        }
      }
      return next.size > 0 ? next : new Set(items.map((item) => item.id))
    })
  }, [itemIdsKey, items])

  const selectedItems = items.filter((item) => selectedItemIds.has(item.id))
  const selectedCount = selectedItems.length
  const allSelected = items.length > 0 && selectedCount === items.length
  const someSelected = selectedCount > 0 && !allSelected
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + toAmount(item.subtotal),
    0,
  )

  const {
    couponCode,
    setCouponCode,
    appliedCoupon,
    discountAmount,
    finalAmount,
    handleApplyCoupon,
    isValidatingCoupon,
  } = useCheckoutCoupon(selectedTotal)

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

  const handleToggleItem = (itemId: string, checked: boolean) => {
    setSelectedItemIds((previous) => {
      const next = new Set(previous)
      if (checked) {
        next.add(itemId)
      } else {
        next.delete(itemId)
      }
      return next
    })
  }

  const handleToggleSelectAll = (checked: boolean) => {
    setSelectedItemIds(checked ? new Set(items.map((item) => item.id)) : new Set())
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

  const handleCheckout = () => {
    if (selectedCount === 0) {
      message.warning(translate('cart.messages.selectItems'))
      return
    }

    if (!cart) {
      return
    }

    clearPartialCheckoutSession()

    if (selectedCount < items.length) {
      startPartialCheckoutSession(selectedItems, cart)
    }

    navigate(PATHS.CHECKOUT)
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
          {translate('cart.subtitle', { count: items.length })}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <label className="customer-panel flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(event) => handleToggleSelectAll(event.target.checked)}
            />
            <span className="text-sm font-semibold text-slate-700">
              {translate('cart.selectAll')}
            </span>
          </label>

          {items.map((item) => {
            const unitPrice = toAmount(item.unitPrice)
            const subtotal = toAmount(item.subtotal)
            const imageUrl = item.imageUrl ?? ORDER_ITEM_PLACEHOLDER_IMAGE
            const isSelected = selectedItemIds.has(item.id)

            return (
              <article
                key={item.id}
                className="customer-panel flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center sm:p-5"
              >
                <Checkbox
                  checked={isSelected}
                  onChange={(event) => handleToggleItem(item.id, event.target.checked)}
                  aria-label={translate('cart.selectItem')}
                  className="self-start sm:self-center"
                />

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
          <p className="mt-1 text-xs text-slate-500">
            {translate('cart.summary.selectedCount', {
              selected: selectedCount,
              total: items.length,
            })}
          </p>

          <div className="mt-4">
            <CouponInputSection
              couponCode={couponCode}
              onCouponCodeChange={setCouponCode}
              appliedCoupon={appliedCoupon}
              discountAmount={discountAmount}
              onApply={handleApplyCoupon}
              isApplying={isValidatingCoupon}
              titleKey="cart.coupon.title"
              placeholderKey="cart.coupon.placeholder"
              applyKey="cart.coupon.apply"
              discountKey="cart.coupon.discount"
            />
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{translate('cart.summary.subtotal')}</dt>
              <dd className="font-bold text-slate-900">{formatCurrency(selectedTotal)}</dd>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{translate('cart.summary.discount')}</dt>
                <dd className="font-bold text-emerald-600">-{formatCurrency(discountAmount)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{translate('cart.summary.shipping')}</dt>
              <dd className="font-bold text-emerald-600">{translate('cart.summary.free')}</dd>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-slate-900">{translate('cart.summary.total')}</dt>
                <dd className="text-xl font-extrabold text-gradient">{formatCurrency(finalAmount)}</dd>
              </div>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">{translate('cart.summary.freeShippingNote')}</p>
          <Button
            fullWidth
            glow
            rightIcon={<ArrowRight className="size-4" />}
            className="mt-6"
            disabled={selectedCount === 0}
            onClick={handleCheckout}
          >
            {translate('cart.summary.checkout')}
          </Button>
        </aside>
      </div>
    </div>
  )
}
