import { formatCurrency, formatDateTime } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import { OrderStatusBadge } from '@/features/NovaShop/shared/ui/StatusBadge'
import { PATHS, productDetailPath } from '@/router/paths'
import { Spin, message } from 'antd'
import { ArrowLeft, Clock, CreditCard, MapPin, MessageSquare, Package } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { redirectToVnpay, useCreateVnpayPayment } from '../../checkout/hooks/useVnpayPayment'
import { redirectToStripe, useCreateStripePayment } from '../../checkout/hooks/useStripePayment'
import { getVnpayPaymentErrorMessage } from '../../checkout/lib/vnpayPaymentError'
import { getStripePaymentErrorMessage } from '../../checkout/lib/stripePaymentError'
import { useCancelOrder, useConfirmOrderReceived, useOrder } from '../hooks/useOrders'
import {
  canCustomerConfirmReceived,
  getOrderCode,
  getOrderItemImageUrl,
  getOrderShippingLine,
  getOrderTotal,
  getPaymentMethodLabel,
  isOrderCancellable,
  isStripeAwaitingPayment,
  isVnpayAwaitingPayment,
  toCustomerOrderDisplayStatus,
  toOrderNumber,
} from '../lib/orderApi'
import { ordersPathWithPaymentFeedback } from '../lib/paymentReturn'

export default function OrderDetailPage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const orderQuery = useOrder(id)
  const cancelOrderMutation = useCancelOrder()
  const confirmReceivedMutation = useConfirmOrderReceived()
  const vnpayPaymentMutation = useCreateVnpayPayment()
  const stripePaymentMutation = useCreateStripePayment()
  const [isPaymentRedirecting, setIsPaymentRedirecting] = useState(false)
  const order = orderQuery.data

  if (orderQuery.isLoading || isPaymentRedirecting || vnpayPaymentMutation.isPending || stripePaymentMutation.isPending) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4">
        <Spin size="large" />
        {isPaymentRedirecting || vnpayPaymentMutation.isPending || stripePaymentMutation.isPending ? (
          <p className="text-sm font-medium text-slate-600">
            {order?.paymentMethod === 'STRIPE'
              ? translate('checkout.stripe.redirecting')
              : translate('checkout.vnpay.redirecting')}
          </p>
        ) : null}
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{translate('orders.detail.notFound')}</h1>
        <Link
          to={PATHS.ORDERS}
          className="mt-4 inline-flex items-center gap-2 text-fuchsia-600 hover:underline"
        >
          <ArrowLeft className="size-4" />
          {translate('orders.detail.backToList')}
        </Link>
      </div>
    )
  }

  const customerStatus = toCustomerOrderDisplayStatus(order)
  const orderCode = getOrderCode(order)
  const showVnpayPayButton = isVnpayAwaitingPayment(order)
  const showStripePayButton = isStripeAwaitingPayment(order)
  const showConfirmReceivedButton = canCustomerConfirmReceived(order)

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate(order.id)
  }

  const handleConfirmReceived = () => {
    confirmReceivedMutation.mutate(order.id, {
      onSuccess: () => message.success(translate('orders.detail.confirmReceivedSuccess')),
    })
  }

  const handlePayWithVnpay = () => {
    setIsPaymentRedirecting(true)
    vnpayPaymentMutation.mutate(order.id, {
      onSuccess: ({ paymentUrl }) => redirectToVnpay(paymentUrl),
      onError: (error) => {
        setIsPaymentRedirecting(false)
        message.error(getVnpayPaymentErrorMessage(error, translate))
        navigate(ordersPathWithPaymentFeedback('vnpay', 'failed', order.id), { replace: true })
      },
    })
  }

  const handlePayWithStripe = () => {
    setIsPaymentRedirecting(true)
    stripePaymentMutation.mutate(order.id, {
      onSuccess: ({ checkoutUrl }) => redirectToStripe(checkoutUrl),
      onError: (error) => {
        setIsPaymentRedirecting(false)
        message.error(getStripePaymentErrorMessage(error, translate))
        navigate(ordersPathWithPaymentFeedback('stripe', 'failed', order.id), { replace: true })
      },
    })
  }

  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6 lg:px-10">
      <button
        type="button"
        onClick={() => navigate(PATHS.ORDERS)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-600 hover:underline"
      >
        <ArrowLeft className="size-4" />
        {translate('orders.detail.backToList')}
      </button>

      <article className="customer-panel overflow-hidden rounded-3xl">
        <header className="flex flex-col gap-4 border-b border-slate-200/80 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-purple-500 text-white shadow-md">
              <Package className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {translate('orders.orderCode')}
              </p>
              <p className="font-mono text-xl font-extrabold tracking-tight text-slate-900">
                {orderCode}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="size-3.5 shrink-0" />
                {translate('orders.placedAt')} {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>
          <OrderStatusBadge status={customerStatus} />
        </header>

        <ul className="space-y-3 p-5 sm:p-6">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-3"
            >
              <Link
                to={productDetailPath(item.productId)}
                className="size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100"
              >
                <img
                  src={getOrderItemImageUrl(item)}
                  alt={item.productName}
                  className="size-full object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={productDetailPath(item.productId)}
                  className="line-clamp-2 text-sm font-bold text-slate-900 hover:text-fuchsia-600"
                >
                  {item.productName}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  {translate('orders.quantity')}: {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-extrabold text-gradient">
                {formatCurrency(toOrderNumber(item.price) * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="grid gap-3 border-t border-slate-200/80 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/60">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
              <CreditCard className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {translate('orders.payment')}
              </p>
              <p className="truncate text-sm font-semibold text-slate-800">
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/60">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
              <MapPin className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {translate('orders.shippingAddress')}
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {getOrderShippingLine(order, translate('orders.noShippingAddress'))}
              </p>
            </div>
          </div>
          {order.note ? (
            <div className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/60 sm:col-span-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <MessageSquare className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {translate('orders.note')}
                </p>
                <p className="text-sm font-semibold text-slate-800">{order.note}</p>
              </div>
            </div>
          ) : null}
          {order.trackingCode ? (
            <div className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/60 sm:col-span-2">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {translate('orders.detail.trackingCode')}
                </p>
                <p className="font-mono text-sm font-semibold text-slate-800">{order.trackingCode}</p>
              </div>
            </div>
          ) : null}
          {order.deliveredAt ? (
            <div className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/60 sm:col-span-2">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {translate('orders.detail.deliveredAt')}
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {formatDateTime(order.deliveredAt)}
                </p>
              </div>
            </div>
          ) : null}
          {order.deliveryProofUrl ? (
            <div className="flex flex-col gap-2 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/60 sm:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {translate('orders.detail.deliveryProof')}
              </p>
              <a href={order.deliveryProofUrl} target="_blank" rel="noreferrer">
                <img
                  src={order.deliveryProofUrl}
                  alt={translate('orders.detail.deliveryProof')}
                  className="max-h-48 rounded-xl object-cover ring-1 ring-slate-200/80"
                />
              </a>
            </div>
          ) : null}
          <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/60 sm:col-span-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {translate('orders.total')}
              </p>
              <p className="text-2xl font-extrabold text-gradient">
                {formatCurrency(getOrderTotal(order))}
              </p>
            </div>
          </div>
        </div>

        {(showVnpayPayButton ||
          showStripePayButton ||
          showConfirmReceivedButton ||
          isOrderCancellable(order)) && (
          <footer className="flex flex-wrap gap-3 border-t border-slate-200/80 p-5 sm:p-6">
            {showConfirmReceivedButton ? (
              <Button glow loading={confirmReceivedMutation.isPending} onClick={handleConfirmReceived}>
                {translate('orders.detail.confirmReceived')}
              </Button>
            ) : null}
            {showVnpayPayButton ? (
              <Button glow loading={vnpayPaymentMutation.isPending} onClick={handlePayWithVnpay}>
                {translate('orders.vnpay.payNow')}
              </Button>
            ) : null}
            {showStripePayButton ? (
              <Button glow loading={stripePaymentMutation.isPending} onClick={handlePayWithStripe}>
                {translate('orders.stripe.payNow')}
              </Button>
            ) : null}
            {isOrderCancellable(order) ? (
              <Button
                variant="outline"
                loading={cancelOrderMutation.isPending}
                onClick={handleCancelOrder}
              >
                {translate('orders.cancel')}
              </Button>
            ) : null}
          </footer>
        )}
      </article>
    </div>
  )
}
