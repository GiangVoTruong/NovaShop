import { useState } from 'react'
import { Input, Select } from 'antd'
import { Download, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ORDERS } from '@/features/NovaShop/shared/data/orders'
import { formatCurrency, formatDateTime } from '@/features/NovaShop/shared/format'
import type { Order, OrderStatus } from '@/features/NovaShop/shared/types'
import Button from '@/features/NovaShop/shared/ui/Button'
import { OrderStatusBadge } from '@/features/NovaShop/shared/ui/StatusBadge'
import AdminListPage from '../../layout/components/AdminListPage'
import AdminTable from '../../layout/components/AdminTable'
import { adminTableAvatar, adminTableText } from '../../layout/constants/adminTableStyles'

const ORDER_STATUS_FILTER_VALUES = [
  'pending',
  'confirmed',
  'packing',
  'shipping',
  'delivered',
  'cancelled',
] as const satisfies readonly OrderStatus[]

export default function AdminOrdersPage() {
  const { t: translate } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredOrders = ORDERS.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false
    if (!search) return true
    const keyword = search.toLowerCase()
    return (
      order.code.toLowerCase().includes(keyword) ||
      order.customerName.toLowerCase().includes(keyword) ||
      order.customerEmail.toLowerCase().includes(keyword)
    )
  })

  const statusFilterOptions = [
    { value: 'all', label: translate('admin.orders.filterAll') },
    ...ORDER_STATUS_FILTER_VALUES.map((status) => ({
      value: status,
      label: translate(`status.order.${status}`),
    })),
  ]

  const columns = [
    {
      title: translate('admin.orders.columns.code'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <span className={adminTableText.code}>{code}</span>,
    },
    {
      title: translate('admin.orders.columns.customer'),
      key: 'customer',
      render: (_: unknown, order: Order) => (
        <div className="flex items-center gap-2.5">
          <img src={order.customerAvatar} alt={order.customerName} className={adminTableAvatar} />
          <div>
            <p className={adminTableText.primary}>{order.customerName}</p>
            <p className={adminTableText.secondary}>{order.customerEmail}</p>
          </div>
        </div>
      ),
    },
    {
      title: translate('admin.orders.columns.items'),
      key: 'items',
      render: (_: unknown, order: Order) => (
        <span className={adminTableText.body}>
          {translate('admin.orders.columns.itemsCount', { count: order.items.length })}
        </span>
      ),
    },
    {
      title: translate('admin.orders.columns.total'),
      key: 'total',
      render: (_: unknown, order: Order) => (
        <span className={adminTableText.money}>{formatCurrency(order.total)}</span>
      ),
    },
    {
      title: translate('admin.orders.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => <OrderStatusBadge status={status} />,
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
      render: () => (
        <Button variant="ghost" size="sm">
          {translate('admin.orders.detail')}
        </Button>
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
        <Button variant="outline" leftIcon={<Download className="size-4" />}>
          {translate('admin.orders.exportCsv')}
        </Button>
      }
      toolbar={
        <>
          <Input
            prefix={<Search className="size-4 text-slate-400" />}
            placeholder={translate('admin.orders.searchPlaceholder')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:flex-1"
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-52"
            options={statusFilterOptions}
          />
        </>
      }
    >
      <AdminTable rowKey="id" columns={columns} dataSource={filteredOrders} scroll={{ x: 1000 }} />
    </AdminListPage>
  )
}
