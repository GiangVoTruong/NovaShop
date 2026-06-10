import { useMemo, useState } from 'react'
import { Alert, Spin } from 'antd'
import {
  ArrowRight,
  Clock,
  CreditCard,
  MapPin,
  Package,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { orderDetailPath, PATHS, productDetailPath } from '@/router/paths'
import {
  CUSTOMER_ORDER_TABS,
  ORDER_STATUS_ACCENT,
  ORDER_STATUS_GLOW,
} from '../constants/orders.constants'
import { useCancelOrder, useOrders } from '../hooks/useOrders'
import { usePaymentReturnFeedback } from '../hooks/usePaymentReturnFeedback'
import {
  getOrderCode,
  getOrderItemImageUrl,
  getOrderShippingLine,
  getOrderTotal,
  getPaymentMethodLabel,
  isActiveCustomerOrder,
  isOrderCancellable,
  matchesCustomerOrderTab,
  toCustomerOrderDisplayStatus,
  toCustomerOrderStatus,
  toOrderNumber,
} from '../lib/orderApi'
import type { ApiOrderResponse } from '@/types/order.types'
import type { OrderStatus } from '@/features/NovaShop/shared/types'
import { formatCurrency, formatDateTime } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import { OrderStatusBadge } from '@/features/NovaShop/shared/ui/StatusBadge'
import { cx } from '@/features/NovaShop/shared/ui/cx'

const STAT_CARDS = [
  {
    key: 'total',
    labelKey: 'orders.stats.total',
    icon: Package,
    iconClass: 'from-fuchsia-500 to-purple-500',
    value: (orders: ApiOrderResponse[]) => orders.length,
  },
  {
    key: 'active',
    labelKey: 'orders.stats.active',
    icon: Truck,
    iconClass: 'from-cyan-400 to-blue-500',
    value: (orders: ApiOrderResponse[]) =>
      orders.filter((order) => isActiveCustomerOrder(order)).length,
  },
  {
    key: 'delivered',
    labelKey: 'orders.stats.delivered',
    icon: ShoppingBag,
    iconClass: 'from-emerald-400 to-teal-500',
    value: (orders: ApiOrderResponse[]) =>
      orders.filter((order) => toCustomerOrderStatus(order.status) === 'delivered').length,
  },
  {
    key: 'spent',
    labelKey: 'orders.stats.spent',
    icon: CreditCard,
    iconClass: 'from-amber-400 to-orange-500',
    value: (orders: ApiOrderResponse[]) =>
      orders.reduce((sum, order) => sum + getOrderTotal(order), 0),
  },
] as const

export default function OrdersPage() {
  const { t: translate } = useTranslation()
  const ordersQuery = useOrders()
  const cancelOrderMutation = useCancelOrder()
  const paymentFeedback = usePaymentReturnFeedback(() => {
    void ordersQuery.refetch()
  })
  const [tab, setTab] = useState<'all' | OrderStatus>('all')
  const [search, setSearch] = useState<string>('')

  const orders = ordersQuery.data ?? []

  const filtered = orders.filter((order) => {
    if (!matchesCustomerOrderTab(order, tab)) return false
    const orderCode = getOrderCode(order)
    if (
      search &&
      !orderCode.toLowerCase().includes(search.toLowerCase()) &&
      !order.items.some((item) =>
        item.productName.toLowerCase().includes(search.toLowerCase()),
      )
    )
      return false
    return true
  })

  const stats = useMemo(() => {
    const orderList = ordersQuery.data ?? []
    const totalOrders = orderList.length
    const activeOrders = orderList.filter((order) => isActiveCustomerOrder(order)).length
    const deliveredOrders = orderList.filter(
      (order) => toCustomerOrderStatus(order.status) === 'delivered',
    ).length
    const totalSpent = orderList.reduce((sum, order) => sum + getOrderTotal(order), 0)

    return [
      { ...STAT_CARDS[0], displayValue: String(totalOrders), isCurrency: false },
      { ...STAT_CARDS[1], displayValue: String(activeOrders), isCurrency: false },
      { ...STAT_CARDS[2], displayValue: String(deliveredOrders), isCurrency: false },
      { ...STAT_CARDS[3], displayValue: formatCurrency(totalSpent), isCurrency: true },
    ]
  }, [ordersQuery.data])

  const handleCancelOrder = (orderId: string) => {
    cancelOrderMutation.mutate(orderId)
  }

  if (ordersQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {translate('orders.eyebrow')}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {translate('orders.title')}{' '}
          <span className="text-gradient">{translate('orders.titleHighlight')}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">{translate('orders.subtitle')}</p>
      </header>

      {paymentFeedback?.feedback === 'success' ? (
        <Alert
          type="success"
          showIcon
          className="mb-6"
          message={translate(`orders.${paymentFeedback.provider}.successTitle`)}
          description={translate(`orders.${paymentFeedback.provider}.successDesc`)}
        />
      ) : null}
      {paymentFeedback?.feedback === 'failed' ? (
        <Alert
          type="error"
          showIcon
          className="mb-6"
          message={translate(`orders.${paymentFeedback.provider}.failedTitle`)}
          description={translate(`orders.${paymentFeedback.provider}.failedDesc`)}
        />
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="customer-panel flex items-center gap-4 rounded-3xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span
              className={cx(
                'grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br text-white shadow-md',
                stat.iconClass,
              )}
            >
              <stat.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {translate(stat.labelKey)}
              </p>
              <p
                className={cx(
                  'mt-0.5 truncate font-extrabold tracking-tight text-slate-900',
                  stat.isCurrency ? 'text-xl text-gradient' : 'text-2xl',
                )}
              >
                {stat.displayValue}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="customer-panel mb-6 flex flex-col gap-3 rounded-3xl p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-slate-100/80 p-1 no-scrollbar sm:flex-1">
          {CUSTOMER_ORDER_TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              className={cx(
                'whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                tab === entry.id
                  ? 'customer-nav-pill text-white'
                  : 'text-slate-600 hover:bg-white/80 hover:text-slate-900',
              )}
            >
              {translate(entry.labelKey)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3 sm:w-72">
          <Search className="size-4 shrink-0 text-fuchsia-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={translate('orders.searchPlaceholder')}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="size-7" />}
          title={translate('orders.empty.title')}
          description={translate('orders.empty.description')}
          action={
            <Link to={PATHS.PRODUCTS}>
              <Button rightIcon={<ArrowRight className="size-4" />} glow>
                {translate('orders.empty.shopNow')}
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-5">
          {filtered.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
            const customerStatus = toCustomerOrderDisplayStatus(order)
            const orderCode = getOrderCode(order)

            return (
              <article
                key={order.id}
                className={cx(
                  'customer-panel relative overflow-hidden rounded-3xl border-l-4 transition-all hover:-translate-y-0.5 hover:shadow-xl',
                  ORDER_STATUS_ACCENT[customerStatus],
                )}
              >
                <div
                  aria-hidden
                  className={cx(
                    'pointer-events-none absolute inset-0 bg-linear-to-br opacity-60',
                    ORDER_STATUS_GLOW[customerStatus],
                  )}
                />

                <div className="relative p-5 sm:p-6">
                  <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-purple-500 text-white shadow-md">
                        <Package className="size-5" />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {translate('orders.orderCode')}
                        </p>
                        <p className="font-mono text-base font-extrabold tracking-tight text-slate-900">
                          {orderCode}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="size-3.5 shrink-0" />
                          {translate('orders.placedAt')} {formatDateTime(order.createdAt)}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-slate-400">
                          {translate('orders.itemCount', { count: itemCount })}
                        </p>
                      </div>
                    </div>
                    <OrderStatusBadge status={customerStatus} />
                  </header>

                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-3 transition-colors hover:border-fuchsia-200 hover:bg-white"
                      >
                        <Link
                          to={productDetailPath(item.productId)}
                          className="size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/80"
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
                            className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 hover:text-fuchsia-600"
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

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
                        <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                          {getOrderShippingLine(order, translate('orders.noShippingAddress'))}
                        </p>
                      </div>
                    </div>
                  </div>

                  <footer className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {translate('orders.total')}
                      </p>
                      <p className="text-2xl font-extrabold tracking-tight text-gradient">
                        {formatCurrency(getOrderTotal(order))}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {isOrderCancellable(order) && (
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => handleCancelOrder(order.id)}
                          loading={cancelOrderMutation.isPending}
                        >
                          {translate('orders.cancel')}
                        </Button>
                      )}
                      <Button variant="outline" size="md" leftIcon={<RotateCcw className="size-4" />}>
                        {translate('orders.reorder')}
                      </Button>
                      <Link to={orderDetailPath(order.id)}>
                        <Button size="md" rightIcon={<ArrowRight className="size-4" />}>
                          {translate('orders.viewDetail')}
                        </Button>
                      </Link>
                    </div>
                  </footer>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
