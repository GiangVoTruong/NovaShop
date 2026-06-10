import { useAddresses } from '@/features/NovaShop/customer/profile/hooks/useAddresses'
import { formatAddressLine, getAddressLabel } from '@/features/NovaShop/customer/profile/lib/addressApi'
import { formatCurrency } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { orderDetailPath, PATHS, productDetailPath } from '@/router/paths'
import { ordersPathWithPaymentFeedback } from '../../orders/lib/paymentReturn'
import type { ApiPaymentMethod } from '@/types/order.types'
import type { ValidateCouponResponse } from '@/types/coupon.types'
import { Input, Spin, message } from 'antd'
import { ArrowLeft, ArrowRight, MapPin, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../cart/hooks/useCart'
import { useValidateCoupon } from '../hooks/useCoupon'
import { redirectToVnpay, useCreateVnpayPayment } from '../hooks/useVnpayPayment'
import { redirectToStripe, useCreateStripePayment } from '../hooks/useStripePayment'
import { getVnpayPaymentErrorMessage } from '../lib/vnpayPaymentError'
import { getStripePaymentErrorMessage } from '../lib/stripePaymentError'
import { ORDER_ITEM_PLACEHOLDER_IMAGE } from '../../orders/lib/orderApi'
import { useCheckout } from '../../orders/hooks/useOrders'
import { getOrderCode } from '../../orders/lib/orderApi'

const PAYMENT_OPTIONS: ApiPaymentMethod[] = ['COD', 'VNPAY', 'STRIPE']

const PAYMENT_LABEL_KEYS = {
  COD: 'checkout.payment.cod',
  VNPAY: 'checkout.payment.vnpay',
  STRIPE: 'checkout.payment.stripe',
} as const satisfies Record<ApiPaymentMethod, string>

function toAmount(value: number | string): number {
  return typeof value === 'number' ? value : Number(value)
}

export default function CheckoutPage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const cartQuery = useCart()
  const addressesQuery = useAddresses()
  const checkoutMutation = useCheckout()
  const vnpayPaymentMutation = useCreateVnpayPayment()
  const stripePaymentMutation = useCreateStripePayment()
  const validateCouponMutation = useValidateCoupon()
  const [paymentMethod, setPaymentMethod] = useState<ApiPaymentMethod>('COD')
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null)
  const [note, setNote] = useState('')
  const [isPaymentRedirecting, setIsPaymentRedirecting] = useState(false)

  const cart = cartQuery.data
  const items = cart?.items ?? []
  const totalAmount = toAmount(cart?.totalAmount ?? 0)
  const addresses = addressesQuery.data ?? []
  const discountAmount = appliedCoupon?.valid ? toAmount(appliedCoupon.discountAmount) : 0
  const finalAmount = Math.max(0, totalAmount - discountAmount)

  useEffect(() => {
    if (selectedAddressId || addresses.length === 0) {
      return
    }

    const defaultAddress = addresses.find((address) => address.isDefault)
    setSelectedAddressId(defaultAddress?.id ?? addresses[0]?.id)
  }, [addresses, selectedAddressId])

  if (isPaymentRedirecting || vnpayPaymentMutation.isPending || stripePaymentMutation.isPending) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4">
        <Spin size="large" />
        <p className="text-sm font-medium text-slate-600">
          {paymentMethod === 'STRIPE'
            ? translate('checkout.stripe.redirecting')
            : translate('checkout.vnpay.redirecting')}
        </p>
      </div>
    )
  }

  if (cartQuery.isLoading || addressesQuery.isLoading) {
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
          title={translate('checkout.empty.title')}
          description={translate('checkout.empty.description')}
          action={
            <Link to={PATHS.PRODUCTS}>
              <Button rightIcon={<ArrowRight className="size-4" />} glow>
                {translate('checkout.empty.shopNow')}
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const handleApplyCoupon = () => {
    const trimmedCode = couponCode.trim()
    if (!trimmedCode) {
      return
    }

    validateCouponMutation.mutate(
      { code: trimmedCode, cartTotal: totalAmount },
      {
        onSuccess: (response) => {
          if (!response.valid) {
            setAppliedCoupon(null)
            message.warning(response.message || translate('checkout.coupon.invalid'))
            return
          }

          setAppliedCoupon(response)
          message.success(translate('checkout.coupon.applied'))
        },
        onError: () => message.error(translate('checkout.coupon.failed')),
      },
    )
  }

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      message.warning(translate('checkout.messages.noAddress'))
      return
    }

    checkoutMutation.mutate(
      {
        paymentMethod,
        addressId: selectedAddressId,
        couponCode: appliedCoupon?.valid ? couponCode.trim() : undefined,
        note: note.trim() || undefined,
      },
      {
        onSuccess: (order) => {
          if (paymentMethod === 'VNPAY') {
            setIsPaymentRedirecting(true)
            vnpayPaymentMutation.mutate(order.id, {
              onSuccess: ({ paymentUrl }) => redirectToVnpay(paymentUrl),
              onError: (error) => {
                setIsPaymentRedirecting(false)
                message.error(getVnpayPaymentErrorMessage(error, translate))
                navigate(ordersPathWithPaymentFeedback('vnpay', 'failed', order.id), { replace: true })
              },
            })
            return
          }

          if (paymentMethod === 'STRIPE') {
            setIsPaymentRedirecting(true)
            stripePaymentMutation.mutate(order.id, {
              onSuccess: ({ checkoutUrl }) => redirectToStripe(checkoutUrl),
              onError: (error) => {
                setIsPaymentRedirecting(false)
                message.error(getStripePaymentErrorMessage(error, translate))
                navigate(ordersPathWithPaymentFeedback('stripe', 'failed', order.id), { replace: true })
              },
            })
            return
          }

          navigate(orderDetailPath(order.id), {
            replace: true,
            state: { orderCode: getOrderCode(order) },
          })
        },
        onError: () => message.error(translate('checkout.messages.failed')),
      },
    )
  }

  const isSubmitting =
    checkoutMutation.isPending || vnpayPaymentMutation.isPending || stripePaymentMutation.isPending
  const placeOrderLabel =
    paymentMethod === 'VNPAY'
      ? translate('checkout.order.placeOrderVnpay')
      : paymentMethod === 'STRIPE'
        ? translate('checkout.order.placeOrderStripe')
        : translate('checkout.order.placeOrder')

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <Link
        to={PATHS.CART}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-600 hover:underline"
      >
        <ArrowLeft className="size-4" />
        {translate('checkout.backToCart')}
      </Link>

      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {translate('checkout.stepLabel')}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
          {translate('checkout.title')}{' '}
          <span className="text-gradient">{translate('checkout.titleHighlight')}</span>
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="customer-panel rounded-3xl p-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              {translate('checkout.sections.address')}
            </h2>
            {addresses.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                {translate('checkout.address.empty')}{' '}
                <Link to={PATHS.PROFILE} className="font-bold text-fuchsia-600 hover:underline">
                  {translate('checkout.address.addLink')}
                </Link>
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {addresses.map((address) => {
                  const isSelected = selectedAddressId === address.id

                  return (
                    <label
                      key={address.id}
                      className={cx(
                        'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
                        isSelected
                          ? 'border-fuchsia-300 bg-fuchsia-50/60'
                          : 'border-slate-200 bg-white hover:border-fuchsia-200',
                      )}
                    >
                      <input
                        type="radio"
                        name="addressId"
                        value={address.id}
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1 size-4 accent-fuchsia-600"
                      />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <MapPin className="size-4 text-fuchsia-500" />
                          {getAddressLabel(address)}
                          {address.isDefault && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              {translate('checkout.address.default')}
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-sm text-slate-500">
                          {formatAddressLine(address)}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">
                          {address.recipientName} · {address.phone}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </section>

          <section className="customer-panel rounded-3xl p-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              {translate('checkout.sections.payment')}
            </h2>
            <div className="mt-4 space-y-3">
              {PAYMENT_OPTIONS.map((method) => {
                const labelKey = PAYMENT_LABEL_KEYS[method]
                const isSelected = paymentMethod === method

                return (
                  <label
                    key={method}
                    className={cx(
                      'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
                      isSelected
                        ? 'border-fuchsia-300 bg-fuchsia-50/60'
                        : 'border-slate-200 bg-white hover:border-fuchsia-200',
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={isSelected}
                      onChange={() => setPaymentMethod(method)}
                      className="mt-1 size-4 accent-fuchsia-600"
                    />
                    <span>
                      <span className="block text-sm font-bold text-slate-900">
                        {translate(`${labelKey}.title`)}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-500">
                        {translate(`${labelKey}.desc`)}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section className="customer-panel rounded-3xl p-6">
            <label className="block text-lg font-extrabold text-slate-900" htmlFor="checkout-note">
              {translate('checkout.fields.note')}
            </label>
            <Input.TextArea
              id="checkout-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={translate('checkout.fields.notePlaceholder')}
              className="mt-4"
              maxLength={500}
            />
          </section>
        </div>

        <aside className="customer-panel h-fit rounded-3xl p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold text-slate-900">
            {translate('checkout.order.title')}
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <Link
                  to={productDetailPath(item.productId)}
                  className="size-14 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                >
                  <img
                    src={item.imageUrl ?? ORDER_ITEM_PLACEHOLDER_IMAGE}
                    alt={item.productName}
                    className="size-full object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                    {item.productName}
                  </p>
                  <p className="text-xs text-slate-500">× {item.quantity}</p>
                </div>
                <p className="shrink-0 text-sm font-bold text-slate-900">
                  {formatCurrency(toAmount(item.subtotal))}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2">
            <p className="text-sm font-bold text-slate-900">{translate('checkout.coupon.title')}</p>
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                placeholder={translate('checkout.coupon.placeholder')}
              />
              <Button
                variant="ghost"
                loading={validateCouponMutation.isPending}
                onClick={handleApplyCoupon}
              >
                {translate('checkout.coupon.apply')}
              </Button>
            </div>
            {appliedCoupon?.valid && (
              <p className="text-xs font-medium text-emerald-600">
                {translate('checkout.coupon.discount', {
                  amount: formatCurrency(discountAmount),
                })}
              </p>
            )}
          </div>

          <dl className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{translate('checkout.order.subtotal')}</dt>
              <dd className="font-bold text-slate-900">{formatCurrency(totalAmount)}</dd>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">{translate('checkout.order.discount')}</dt>
                <dd className="font-bold text-emerald-600">-{formatCurrency(discountAmount)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">{translate('checkout.order.shipping')}</dt>
              <dd className="font-bold text-emerald-600">{translate('checkout.order.free')}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
              <dt className="font-bold text-slate-900">{translate('checkout.order.total')}</dt>
              <dd className="text-xl font-extrabold text-gradient">{formatCurrency(finalAmount)}</dd>
            </div>
          </dl>

          <Button
            fullWidth
            glow
            className="mt-6"
            loading={isSubmitting}
            onClick={handlePlaceOrder}
          >
            {placeOrderLabel}
          </Button>
        </aside>
      </div>
    </div>
  )
}
