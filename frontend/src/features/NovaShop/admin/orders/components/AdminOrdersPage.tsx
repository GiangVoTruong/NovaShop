import { useState } from 'react'
import { Input, Select, message } from 'antd'
import { Download, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDateTime } from '@/features/NovaShop/shared/format'
import { adminOrderDetailPath } from '@/router/paths'
import type { AdminOrderResponse } from '@/types/admin.types'
import type { ApiOrderStatus } from '@/types/order.types'
import Button from '@/features/NovaShop/shared/ui/Button'
import AdminListPage from '../../layout/components/AdminListPage'
import AdminTable from '../../layout/components/AdminTable'
import { adminTableText } from '../../layout/constants/adminTableStyles'
import { useAdminOrders, useUpdateAdminOrderStatus } from '../../hooks/useAdminOrders'
import {
  ADMIN_ORDER_STATUSES,
  getAdminOrderCode,
  getAdminOrderTotal,
} from '../../lib/adminApi'
import { normalizeApiOrderStatus } from '@/features/NovaShop/customer/orders/lib/orderApi'

export default function AdminOrdersPage() {
  const { t: translate } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)

  const ordersQuery = useAdminOrders({
    page,
    size: pageSize,
    keyword: search.trim() || undefined,
    status: statusFilter === 'all' ? undefined : (statusFilter as ApiOrderStatus),
    sortBy: 'createdAt',
    sortDir: 'desc',
  })
  const updateStatusMutation = useUpdateAdminOrderStatus()

  const orders = ordersQuery.data?.data ?? []
  const total = ordersQuery.data?.total ?? 0

  const statusFilterOptions = [
    { value: 'all', label: translate('admin.orders.filterAll') },
    ...ADMIN_ORDER_STATUSES.map((status) => ({
      value: status,
      label: translate(`status.order.${status.toLowerCase()}`),
    })),
  ]

  const statusSelectOptions = ADMIN_ORDER_STATUSES.map((status) => ({
    value: status,
    label: translate(`status.order.${status.toLowerCase()}`),
  }))

  const handleStatusChange = (order: AdminOrderResponse, nextStatus: ApiOrderStatus) => {
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

  const columns = [
    {
      title: translate('admin.orders.columns.code'),
      key: 'code',
      render: (_: unknown, order: AdminOrderResponse) => (
        <Link to={adminOrderDetailPath(order.id)} className={adminTableText.code}>
          {getAdminOrderCode(order)}
        </Link>
      ),
    },
    {
      title: translate('admin.orders.columns.customer'),
      key: 'customer',
      render: (_: unknown, order: AdminOrderResponse) => (
        <div>
          <p className={adminTableText.primary}>{order.customerFullName}</p>
          <p className={adminTableText.secondary}>{order.customerEmail}</p>
        </div>
      ),
    },
    {
      title: translate('admin.orders.columns.items'),
      key: 'items',
      render: (_: unknown, order: AdminOrderResponse) => (
        <span className={adminTableText.body}>
          {translate('admin.orders.columns.itemsCount', { count: order.itemCount })}
        </span>
      ),
    },
    {
      title: translate('admin.orders.columns.total'),
      key: 'total',
      render: (_: unknown, order: AdminOrderResponse) => (
        <span className={adminTableText.money}>{formatCurrency(getAdminOrderTotal(order))}</span>
      ),
    },
    {
      title: translate('admin.orders.columns.status'),
      key: 'status',
      render: (_: unknown, order: AdminOrderResponse) => (
        <Select
          size="small"
          value={normalizeApiOrderStatus(order.status)}
          options={statusSelectOptions}
          loading={updateStatusMutation.isPending}
          className="min-w-[140px]"
          onChange={(nextStatus) => handleStatusChange(order, nextStatus)}
        />
      ),
    },
    {
      title: translate('admin.orders.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span className={adminTableText.muted}>{formatDateTime(createdAt)}</span>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, order: AdminOrderResponse) => (
        <Link to={adminOrderDetailPath(order.id)}>
          <Button variant="ghost" size="sm">
            {translate('admin.orders.detail')}
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <AdminListPage
      eyebrow={translate('admin.orders.eyebrow')}
      title={translate('admin.orders.title')}
      titleHighlight={translate('admin.orders.titleHighlight')}
      description={translate('admin.orders.description')}
      actions={
        <Button variant="outline" leftIcon={<Download className="size-4" />} disabled>
          {translate('admin.orders.exportCsv')}
        </Button>
      }
      toolbar={
        <>
          <Input
            prefix={<Search className="size-4 text-slate-400" />}
            placeholder={translate('admin.orders.searchPlaceholder')}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(0)
            }}
            className="sm:flex-1"
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value)
              setPage(0)
            }}
            className="w-full sm:w-52"
            options={statusFilterOptions}
          />
        </>
      }
    >
      <AdminTable
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={ordersQuery.isLoading}
        scroll={{ x: 1000 }}
        pagination={{
          current: page + 1,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPage - 1)
            setPageSize(nextPageSize)
          },
        }}
      />
    </AdminListPage>
  )
}
