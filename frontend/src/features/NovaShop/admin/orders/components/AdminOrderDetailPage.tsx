import type { ReactNode } from 'react'
import { useState } from 'react'
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
import { normalizeApiOrderStatus } from '@/features/NovaShop/customer/orders/lib/orderApi'
import Button from '@/features/NovaShop/shared/ui/Button'
import {
  canCustomerConfirmReceived,
  canShipperSubmitDeliveryProof,
  canShopConfirmOrder,
  canShopStartShipping,
  getWorkflowOrderStatus,
  ORDER_STATUS_FLOW,
} from '../lib/orderWorkflow'

export default function AdminOrderDetailPage() {
  const { t: translate } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const orderQuery = useAdminOrder(id)
  const updateStatusMutation = useUpdateAdminOrderStatus()
  const order = orderQuery.data
  const [deliveryProofPlaceholder, setDeliveryProofPlaceholder] = useState('')

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
        <Link to={PATHS.ADMIN_ORDERS} className="mt-4 inline-flex items-center gap-2 text-blue-600">
          <ArrowLeft className="size-4" />
          {translate('admin.orders.detailPage.backToList')}
        </Link>
      </AdminShell>
    )
  }

  const orderStatus = getWorkflowOrderStatus(order.status)
  const hasDeliveryProof =
    deliveryProofPlaceholder.trim().length > 0 ||
    orderStatus === 'DELIVERED_PENDING_RECEIVER_CONFIRM' ||
    orderStatus === 'DELIVERED'

  const handleStatusChange = (nextStatus: ApiOrderStatus) => {
    if (orderStatus === nextStatus) {
      return
    }

    updateStatusMutation.mutate(
      { orderId: order.id, request: { status: nextStatus } },
      {
        onSuccess: () => {
          if (nextStatus === 'DELIVERED' && order.paymentMethod === 'COD') {
            message.success(translate('admin.orders.messages.deliveredCodPaid'))
            return
          }
          message.success(translate('admin.orders.messages.statusUpdated'))
        },
        onError: () => message.error(translate('admin.orders.messages.statusFailed')),
      },
    )
  }

  return (
    <AdminShell className="max-w-[960px]">
      <Link
        to={PATHS.ADMIN_ORDERS}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
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
                value={normalizeApiOrderStatus(order.status)}
                options={statusSelectOptions}
                loading={updateStatusMutation.isPending}
                className="min-w-[160px]"
                onChange={handleStatusChange}
              />
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {translate('admin.orders.detailPage.workflowTitle')}
              </p>
              <p className="text-xs text-slate-500">
                {translate('admin.orders.detailPage.workflowHint')}
              </p>
              <ol className="space-y-1 text-xs text-slate-400">
                {ORDER_STATUS_FLOW.map((flowStatus) => (
                  <li
                    key={flowStatus}
                    className={orderStatus === flowStatus ? 'font-semibold text-blue-700' : undefined}
                  >
                    {translate(`status.order.${flowStatus.toLowerCase()}`)}
                    {flowStatus === orderStatus
                      ? ` ${translate('admin.orders.detailPage.workflowCurrent')}`
                      : ''}
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={!canShopConfirmOrder(orderStatus) || updateStatusMutation.isPending}
                  onClick={() => handleStatusChange('CONFIRMED')}
                >
                  {translate('admin.orders.detailPage.shopConfirm')}
                </Button>
                <Button
                  size="sm"
                  disabled={!canShopStartShipping(orderStatus) || updateStatusMutation.isPending}
                  onClick={() => handleStatusChange('SHIPPING')}
                >
                  {translate('admin.orders.detailPage.shopStartShipping')}
                </Button>
                <Button
                  size="sm"
                  disabled={
                    !canShipperSubmitDeliveryProof(orderStatus, hasDeliveryProof) ||
                    updateStatusMutation.isPending
                  }
                  onClick={() => handleStatusChange('DELIVERED_PENDING_RECEIVER_CONFIRM')}
                >
                  {translate('admin.orders.detailPage.shipperDeliveredWithPhoto')}
                </Button>
                <Button
                  size="sm"
                  disabled={
                    !canCustomerConfirmReceived(orderStatus) || updateStatusMutation.isPending
                  }
                  onClick={() => handleStatusChange('DELIVERED')}
                >
                  {translate('admin.orders.detailPage.customerConfirmReceived')}
                </Button>
              </div>
              <div className="space-y-1">
                <label htmlFor="delivery-proof-placeholder" className="text-xs text-slate-400">
                  {translate('admin.orders.detailPage.deliveryProofLabel')}
                </label>
                <input
                  id="delivery-proof-placeholder"
                  value={deliveryProofPlaceholder}
                  onChange={(event) => setDeliveryProofPlaceholder(event.target.value)}
                  placeholder={translate('admin.orders.detailPage.deliveryProofPlaceholder')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400"
                />
              </div>
              {order.paymentMethod === 'COD' && (
                <p className="text-xs text-slate-500">
                  {translate('admin.orders.detailPage.codDeliveredNote')}
                </p>
              )}
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
                <dd className="text-lg font-bold text-slate-900">
                  {formatCurrency(getAdminOrderTotal(order))}
                </dd>
              </div>
              <div className="flex items-start gap-2 border-t border-slate-200 pt-3 text-slate-500">
                <CreditCard className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider">{translate('admin.orders.detailPage.payment')}</p>
                  <p className="text-sm text-slate-700">
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
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              <Link
                to={productDetailPath(item.productId)}
                className="size-14 shrink-0 overflow-hidden rounded-xl bg-slate-100"
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
                  className="line-clamp-2 text-sm font-bold text-slate-900 hover:text-blue-700"
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
        <dd className="text-sm font-medium text-slate-800">{value}</dd>
      </div>
    </div>
  )
}
