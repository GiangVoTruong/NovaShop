import type { ReactNode } from 'react'
import { Select, Spin, message } from 'antd'
import { ArrowLeft, CreditCard, Mail, MapPin, MessageSquare, Phone, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import {
  formatShippingAddress,
  getPaymentMethodLabel,
  ORDER_ITEM_PLACEHOLDER_IMAGE,
  toOrderNumber,
} from '@/features/NovaShop/customer/orders/lib/orderApi'
import { formatCurrency, formatDateTime } from '@/features/NovaShop/shared/format'
import { OrderStatusBadge } from '@/features/NovaShop/shared/ui/StatusBadge'
import { PATHS, productDetailPath } from '@/router/paths'
import type { ApiOrderStatus } from '@/types/order.types'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
import AdminSection from '../../layout/components/AdminSection'
import AdminShell from '../../layout/components/AdminShell'
import { adminTableText } from '../../layout/constants/adminTableStyles'
import { useAdminOrder, useUpdateAdminOrderStatus } from '../../hooks/useAdminOrders'
import {
  ADMIN_ORDER_STATUSES,
  getAdminOrderCode,
  getAdminOrderTotal,
  toAdminAmount,
  toAdminOrderUiStatus,
} from '../../lib/adminApi'

export default function AdminOrderDetailPage() {
  const { t: translate } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const orderQuery = useAdminOrder(id)
  const updateStatusMutation = useUpdateAdminOrderStatus()
  const order = orderQuery.data

  const statusSelectOptions = ADMIN_ORDER_STATUSES.map((status) => ({
    value: status,
    label: translate(`status.order.${status.toLowerCase()}`),
  }))

  if (orderQuery.isLoading) {
    return (
      <AdminShell className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </AdminShell>
    )
  }

  if (!order) {
    return (
      <AdminShell>
        <p className="text-slate-400">{translate('admin.orders.detailPage.notFound')}</p>
        <Link to={PATHS.ADMIN_ORDERS} className="mt-4 inline-flex items-center gap-2 text-fuchsia-400">
          <ArrowLeft className="size-4" />
          {translate('admin.orders.detailPage.backToList')}
        </Link>
      </AdminShell>
    )
  }

  const handleStatusChange = (nextStatus: ApiOrderStatus) => {
    if (order.status === nextStatus) {
      return
    }

    updateStatusMutation.mutate(
      { orderId: order.id, request: { status: nextStatus } },
      {
        onSuccess: () => message.success(translate('admin.orders.messages.statusUpdated')),
        onError: () => message.error(translate('admin.orders.messages.statusFailed')),
      },
    )
  }

  return (
    <AdminShell className="max-w-[960px]">
      <Link
        to={PATHS.ADMIN_ORDERS}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-400 hover:underline"
      >
        <ArrowLeft className="size-4" />
        {translate('admin.orders.detailPage.backToList')}
      </Link>

      <AdminPageHeader
        eyebrow={translate('admin.orders.detailPage.eyebrow')}
        title={getAdminOrderCode(order)}
        description={translate('admin.orders.detailPage.placedAt', {
          time: formatDateTime(order.createdAt),
        })}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminSection title={translate('admin.orders.detailPage.customerTitle')}>
          <dl className="space-y-3 text-sm">
            <DetailRow
              icon={<User className="size-4" />}
              label={translate('admin.orders.detailPage.customerName')}
              value={order.customerFullName}
            />
            <DetailRow
              icon={<Mail className="size-4" />}
              label={translate('admin.orders.detailPage.customerEmail')}
              value={order.customerEmail}
            />
            <DetailRow
              icon={<Phone className="size-4" />}
              label={translate('admin.orders.detailPage.customerPhone')}
              value={order.customerPhone}
            />
          </dl>
        </AdminSection>

        <AdminSection title={translate('admin.orders.detailPage.summaryTitle')}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <OrderStatusBadge status={toAdminOrderUiStatus(order.status)} />
              <Select
                size="small"
                value={order.status}
                options={statusSelectOptions}
                loading={updateStatusMutation.isPending}
                className="min-w-[160px]"
                onChange={handleStatusChange}
              />
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4 text-slate-400">
                <dt>{translate('admin.orders.detailPage.subtotal')}</dt>
                <dd className={adminTableText.money}>
                  {formatCurrency(toAdminAmount(order.totalAmount))}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-slate-400">
                <dt>{translate('admin.orders.detailPage.total')}</dt>
                <dd className="text-lg font-bold text-white">
                  {formatCurrency(getAdminOrderTotal(order))}
                </dd>
              </div>
              <div className="flex items-start gap-2 border-t border-white/10 pt-3 text-slate-400">
                <CreditCard className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider">{translate('admin.orders.detailPage.payment')}</p>
                  <p className="text-sm text-slate-200">
                    {getPaymentMethodLabel(order.paymentMethod)} · {order.paymentStatus}
                  </p>
                </div>
              </div>
            </dl>
          </div>
        </AdminSection>
      </div>

      <AdminSection className="mt-6" title={translate('admin.orders.detailPage.shippingTitle')}>
        <dl className="space-y-3 text-sm">
          <DetailRow
            icon={<MapPin className="size-4" />}
            label={translate('admin.orders.detailPage.shippingTitle')}
            value={formatShippingAddress(
              order.shippingAddress,
              translate('admin.orders.detailPage.noShippingAddress'),
            )}
          />
          {order.note && (
            <DetailRow
              icon={<MessageSquare className="size-4" />}
              label={translate('admin.orders.detailPage.note')}
              value={order.note}
            />
          )}
        </dl>
      </AdminSection>

      <AdminSection className="mt-6" title={translate('admin.orders.detailPage.itemsTitle')}>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <Link
                to={productDetailPath(item.productId)}
                className="size-14 shrink-0 overflow-hidden rounded-xl bg-slate-800"
              >
                <img
                  src={ORDER_ITEM_PLACEHOLDER_IMAGE}
                  alt={item.productName}
                  className="size-full object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={productDetailPath(item.productId)}
                  className="line-clamp-2 text-sm font-bold text-white hover:text-fuchsia-300"
                >
                  {item.productName}
                </Link>
                <p className="mt-1 text-xs text-slate-400">
                  {translate('admin.orders.detailPage.quantity', { count: item.quantity })}
                </p>
              </div>
              <p className={adminTableText.money}>
                {formatCurrency(toOrderNumber(item.subtotal))}
              </p>
            </li>
          ))}
        </ul>
        {order.items.length === 0 && (
          <p className="text-sm text-slate-400">{translate('admin.orders.detailPage.noItems')}</p>
        )}
      </AdminSection>
    </AdminShell>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-500">{icon}</span>
      <div>
        <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
        <dd className="text-sm font-medium text-slate-200">{value}</dd>
      </div>
    </div>
  )
}
