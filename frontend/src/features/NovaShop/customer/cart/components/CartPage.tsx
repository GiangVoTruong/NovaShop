import { useMemo, useState } from 'react'
import { message } from 'antd'
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { PATHS, productDetailPath } from '@/router/paths'
import { PRODUCTS } from '../../../shared/data/products'
import { useShop } from '../../../shared/store/useShop'
import { formatCurrency } from '../../../shared/format'
import Button from '../../../shared/ui/Button'
import EmptyState from '../../../shared/ui/EmptyState'

export default function CartPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, clearCart } = useShop()
  const [couponCode, setCouponCode] = useState<string>('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const lines = useMemo(
    () =>
      cart
        .map((line) => {
          const product = PRODUCTS.find((entry) => entry.id === line.productId)
          if (!product) return null
          return { ...line, product }
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    [cart],
  )

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  )
  const shipping = subtotal === 0 ? 0 : subtotal >= 500000 ? 0 : 30000
  const discount = appliedCoupon === 'NOVA20' ? subtotal * 0.2 : 0
  const total = Math.max(0, subtotal + shipping - discount)

  const handleApplyCoupon = () => {
    if (!couponCode) return
    if (couponCode.toUpperCase() === 'NOVA20') {
      setAppliedCoupon('NOVA20')
      message.success(t('cart.messages.applied'))
    } else {
      message.error(t('cart.messages.invalid'))
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="size-7" />}
          title={t('cart.empty.title')}
          description={t('cart.empty.description')}
          action={
            <Link to={PATHS.PRODUCTS}>
              <Button rightIcon={<ArrowRight className="size-4" />} glow>
                {t('cart.empty.continueShopping')}
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
          {t('cart.stepLabel')}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t('cart.title')} <span className="text-gradient">{t('cart.titleHighlight')}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {t('cart.subtitle', { count: lines.length })}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {lines.map((line) => (
            <article
              key={line.productId}
              className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl transition-all hover:shadow-lg sm:flex-row"
            >
              <Link
                to={productDetailPath(line.productId)}
                className="size-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100"
              >
                <img
                  src={line.product.images[0]}
                  alt={line.product.name}
                  className="size-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {line.product.brand}
                    </p>
                    <Link
                      to={productDetailPath(line.productId)}
                      className="text-base font-bold tracking-tight text-slate-900 hover:text-fuchsia-600"
                    >
                      {line.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-400">
                      SKU: {line.product.sku}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.productId)}
                    className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                    aria-label={t('cart.remove')}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
                  <div className="flex items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(line.productId, line.quantity - 1)
                      }
                      className="grid size-8 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
                      aria-label={t('cart.decrease')}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(line.productId, line.quantity + 1)
                      }
                      className="grid size-8 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
                      aria-label={t('cart.increase')}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <p className="text-xl font-extrabold tracking-tight text-gradient">
                    {formatCurrency(line.product.price * line.quantity)}
                  </p>
                </div>
              </div>
            </article>
          ))}
          <div className="flex justify-between text-sm">
            <Link
              to={PATHS.PRODUCTS}
              className="font-semibold text-fuchsia-600 hover:underline"
            >
              {t('cart.continueShopping')}
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="font-medium text-slate-500 hover:text-rose-500"
            >
              {t('cart.clearAll')}
            </button>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl glow-purple">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-fuchsia-300/30 blur-2xl" />
              <h2 className="relative text-lg font-extrabold tracking-tight text-slate-900">
                {t('cart.summary.title')}
              </h2>
              <dl className="relative mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t('cart.summary.subtotal')}</dt>
                  <dd className="font-bold text-slate-900">
                    {formatCurrency(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t('cart.summary.shipping')}</dt>
                  <dd className="font-bold text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">{t('cart.summary.free')}</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <dt>
                      {t('cart.summary.discount')} ({appliedCoupon})
                    </dt>
                    <dd className="font-bold">-{formatCurrency(discount)}</dd>
                  </div>
                )}
                <div className="border-t border-dashed border-slate-200 pt-3" />
                <div className="flex items-baseline justify-between">
                  <dt className="font-bold text-slate-900">{t('cart.summary.total')}</dt>
                  <dd className="text-2xl font-extrabold tracking-tight text-gradient">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>
              <Button
                size="lg"
                fullWidth
                glow
                className="relative mt-6"
                onClick={() => navigate(PATHS.CHECKOUT)}
                rightIcon={<ArrowRight className="size-4" />}
              >
                {t('cart.summary.checkout')}
              </Button>
              <p className="relative mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Truck className="size-3.5" /> {t('cart.summary.freeShippingNote')}
              </p>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-amber-400 to-orange-500 text-white">
                  <Tag className="size-3.5" />
                </span>
                {t('cart.coupon.title')}
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder={t('cart.coupon.placeholder')}
                  className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                />
                <Button onClick={handleApplyCoupon} size="md">
                  {t('cart.coupon.apply')}
                </Button>
              </div>
              <p className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                <Sparkles className="size-3" /> {t('cart.coupon.hint')}{' '}
                <code className="rounded bg-fuchsia-100 px-1.5 py-0.5 font-mono font-bold text-fuchsia-700">
                  NOVA20
                </code>{' '}
                {t('cart.coupon.hintSuffix')}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
