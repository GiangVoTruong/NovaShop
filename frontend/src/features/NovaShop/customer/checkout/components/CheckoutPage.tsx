import { formatCurrency } from '@/features/NovaShop/shared/format'
import { useCartDisplayLines } from '@/features/NovaShop/shared/store/useCartDisplayLines'
import { useShop } from '@/features/NovaShop/shared/store/useShop'
import Button from '@/features/NovaShop/shared/ui/Button'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { getApiErrorMessage } from '@/lib/axios/instances'
import { PATHS } from '@/router/paths'
import { message, Spin } from 'antd'
import {
  Banknote,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Smartphone,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useCheckout } from '../../orders/hooks/useOrders'
import { toApiPaymentMethod } from '../../orders/lib/checkoutPayment'

type DeliveryMethod = 'standard' | 'express' | 'pickup'
type PaymentMethod = 'card' | 'momo' | 'bank' | 'cod'

const DELIVERIES: {
  id: DeliveryMethod
  price: number
  icon: typeof Truck
  grad: string
}[] = [
  {
    id: 'standard',
    price: 30000,
    icon: Truck,
    grad: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'express',
    price: 60000,
    icon: Zap,
    grad: 'from-fuchsia-500 to-purple-500',
  },
  {
    id: 'pickup',
    price: 0,
    icon: CheckCircle2,
    grad: 'from-emerald-400 to-teal-500',
  },
]

const PAYMENTS: {
  id: PaymentMethod
  icon: typeof CreditCard
  grad: string
}[] = [
  {
    id: 'card',
    icon: CreditCard,
    grad: 'from-fuchsia-500 to-purple-500',
  },
  {
    id: 'momo',
    icon: Smartphone,
    grad: 'from-pink-500 to-rose-500',
  },
  {
    id: 'bank',
    icon: Banknote,
    grad: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'cod',
    icon: Truck,
    grad: 'from-amber-400 to-orange-500',
  },
]

const CHECKOUT_CITIES = ['hcm', 'hanoi', 'danang'] as const
const CHECKOUT_DISTRICTS = ['q1', 'q3', 'q7'] as const

export default function CheckoutPage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const { clearCart } = useShop()
  const { lines, isLoading, subtotal } = useCartDisplayLines()
  const checkoutMutation = useCheckout()
  const [delivery, setDelivery] = useState<DeliveryMethod>('standard')
  const [payment, setPayment] = useState<PaymentMethod>('card')

  const shipping = DELIVERIES.find((entry) => entry.id === delivery)?.price ?? 0
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    checkoutMutation.mutate(
      { paymentMethod: toApiPaymentMethod(payment) },
      {
        onSuccess: async () => {
          message.success(translate('checkout.messages.success'))
          await clearCart()
          navigate(PATHS.ORDERS)
        },
        onError: (error) => {
          message.error(getApiErrorMessage(error, translate('common.error')))
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">
          {translate('checkout.empty.title')}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{translate('checkout.empty.description')}</p>
        <Link to={PATHS.PRODUCTS}>
          <Button className="mt-6" glow>
            {translate('checkout.empty.shopNow')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <Link
        to={PATHS.CART}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-fuchsia-600"
      >
        <ChevronLeft className="size-4" /> {translate('checkout.backToCart')}
      </Link>
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {translate('checkout.stepLabel')}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {translate('checkout.title')}{' '}
          <span className="text-gradient">{translate('checkout.titleHighlight')}</span>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard step="1" title={translate('checkout.sections.address')}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={translate('checkout.fields.fullName')} required>
                <input required defaultValue="Nguyễn Minh Anh" className="checkout-input" />
              </Field>
              <Field label={translate('checkout.fields.phone')} required>
                <input required defaultValue="0901 234 567" className="checkout-input" />
              </Field>
              <Field label={translate('checkout.fields.email')} className="sm:col-span-2">
                <input type="email" defaultValue="minhanh@nova.shop" className="checkout-input" />
              </Field>
              <Field label={translate('checkout.fields.city')} required>
                <select required className="checkout-input">
                  {CHECKOUT_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {translate(`checkout.cities.${city}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={translate('checkout.fields.district')} required>
                <select required className="checkout-input">
                  {CHECKOUT_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {translate(`checkout.districts.${district}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label={translate('checkout.fields.address')}
                required
                className="sm:col-span-2"
              >
                <input
                  required
                  defaultValue="12 Nguyễn Huệ, P. Bến Nghé"
                  className="checkout-input"
                />
              </Field>
              <Field label={translate('checkout.fields.note')} className="sm:col-span-2">
                <textarea
                  rows={3}
                  placeholder={translate('checkout.fields.notePlaceholder')}
                  className="checkout-input min-h-[88px] py-2.5"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard step="2" title={translate('checkout.sections.delivery')}>
            <div className="grid gap-3 sm:grid-cols-3">
              {DELIVERIES.map((option) => (
                <label
                  key={option.id}
                  className={cx(
                    'group/opt relative cursor-pointer overflow-hidden rounded-2xl border-2 bg-white p-4 transition-all',
                    delivery === option.id
                      ? 'border-fuchsia-500 shadow-lg shadow-fuchsia-500/20'
                      : 'border-slate-200 hover:border-fuchsia-300',
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    className="sr-only"
                    checked={delivery === option.id}
                    onChange={() => setDelivery(option.id)}
                  />
                  <span
                    className={cx(
                      'mb-3 inline-grid size-10 place-items-center rounded-xl text-white shadow-md',
                      `bg-linear-to-br ${option.grad}`,
                    )}
                  >
                    <option.icon className="size-5" />
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {translate(`checkout.delivery.${option.id}.title`)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {translate(`checkout.delivery.${option.id}.desc`)}
                  </p>
                  <p className="mt-3 text-base font-extrabold text-slate-900">
                    {option.price === 0 ? (
                      <span className="text-emerald-600">{translate('checkout.order.free')}</span>
                    ) : (
                      formatCurrency(option.price)
                    )}
                  </p>
                </label>
              ))}
            </div>
          </SectionCard>

          <SectionCard step="3" title={translate('checkout.sections.payment')}>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENTS.map((option) => (
                <label
                  key={option.id}
                  className={cx(
                    'group/opt flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white p-4 transition-all',
                    payment === option.id
                      ? 'border-fuchsia-500 shadow-lg shadow-fuchsia-500/20'
                      : 'border-slate-200 hover:border-fuchsia-300',
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={payment === option.id}
                    onChange={() => setPayment(option.id)}
                  />
                  <span
                    className={cx(
                      'grid size-11 place-items-center rounded-xl text-white shadow-md',
                      `bg-linear-to-br ${option.grad}`,
                    )}
                  >
                    <option.icon className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">
                      {translate(`checkout.payment.${option.id}.title`)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {translate(`checkout.payment.${option.id}.desc`)}
                    </p>
                  </div>
                  <span
                    className={cx(
                      'size-5 rounded-full border-2 transition-all',
                      payment === option.id
                        ? 'border-fuchsia-500 bg-fuchsia-500'
                        : 'border-slate-300',
                    )}
                  >
                    {payment === option.id && (
                      <span className="block size-full rounded-full ring-2 ring-inset ring-white" />
                    )}
                  </span>
                </label>
              ))}
            </div>
            {payment === 'card' && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label={translate('checkout.fields.cardNumber')} className="sm:col-span-2">
                  <input
                    placeholder="•••• •••• •••• ••••"
                    className="checkout-input font-mono tracking-widest"
                  />
                </Field>
                <Field label={translate('checkout.fields.cardHolder')}>
                  <input placeholder="NGUYEN MINH ANH" className="checkout-input" />
                </Field>
                <Field label={translate('checkout.fields.cardExpiry')}>
                  <input placeholder="MM/YY" className="checkout-input" />
                </Field>
              </div>
            )}
          </SectionCard>
        </div>

        <aside className="space-y-4 lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl glow-purple">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-fuchsia-300/30 blur-2xl" />
              <h2 className="relative text-lg font-extrabold tracking-tight text-slate-900">
                {translate('checkout.order.title')}
              </h2>
              <ul className="relative mt-4 space-y-3">
                {lines.map((line) => (
                  <li key={line.productId} className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <img src={line.image} alt={line.name} className="size-full object-cover" />
                      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-linear-to-br from-fuchsia-500 to-purple-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {line.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">{line.name}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(line.unitPrice * line.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="relative mt-6 space-y-2 border-t border-dashed border-slate-200 pt-4 text-sm">
                <div className="flex justify-between text-slate-500">
                  <dt>{translate('checkout.order.subtotal')}</dt>
                  <dd className="font-medium text-slate-900">{formatCurrency(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-slate-500">
                  <dt>{translate('checkout.order.shipping')}</dt>
                  <dd className="font-medium text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">{translate('checkout.order.free')}</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between text-slate-500">
                  <dt>{translate('checkout.order.tax')}</dt>
                  <dd className="font-medium text-slate-900">{formatCurrency(tax)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-dashed border-slate-200 pt-3">
                  <dt className="font-bold text-slate-900">{translate('checkout.order.total')}</dt>
                  <dd className="text-2xl font-extrabold tracking-tight text-gradient">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>

              <Button
                type="submit"
                size="lg"
                fullWidth
                glow
                className="relative mt-6"
                leftIcon={<Sparkles className="size-4" />}
                loading={checkoutMutation.isPending}
              >
                {translate('checkout.order.placeOrder')}
              </Button>
              <p className="relative mt-3 text-center text-xs text-slate-500">
                {translate('checkout.order.termsPrefix')}{' '}
                <a href="#" className="text-fuchsia-600 hover:underline">
                  {translate('checkout.order.terms')}
                </a>{' '}
                {translate('checkout.order.termsSuffix')}
              </p>
            </div>
          </div>
        </aside>
      </form>

      <style>{`
        .checkout-input {
          width: 100%;
          height: 46px;
          border-radius: 14px;
          border: 1px solid rgb(226 232 240);
          padding-left: 14px;
          padding-right: 14px;
          font-size: 14px;
          color: rgb(15 23 42);
          background-color: white;
          transition: all 200ms;
        }
        .checkout-input:focus {
          outline: none;
          border-color: rgb(217 70 239);
          box-shadow: 0 0 0 3px rgb(250 232 255);
        }
      `}</style>
    </div>
  )
}

function SectionCard({
  step,
  title,
  children,
}: {
  step: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
      <header className="mb-5 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-fuchsia-500 to-purple-500 text-sm font-extrabold text-white shadow-md">
          {step}
        </span>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{title}</h2>
      </header>
      {children}
    </section>
  )
}

function Field({
  label,
  children,
  required,
  className,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
  className?: string
}) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  )
}
