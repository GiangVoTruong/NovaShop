import { useMemo, useState } from 'react'
import { Input, Select, Table } from 'antd'
import { Download, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ORDERS } from '../../../shared/data/orders'
import { formatCurrency, formatDateTime } from '../../../shared/format'
import type { Order, OrderStatus } from '../../../shared/types'
import Button from '../../../shared/ui/Button'
import { OrderStatusBadge } from '../../../shared/ui/StatusBadge'
import AdminPageHeader from '../../layout/components/AdminPageHeader'

const ORDER_STATUS_FILTER_VALUES = [
  'pending',
  'confirmed',
  'packing',
  'shipping',
  'delivered',
  'cancelled',
] as const satisfies readonly OrderStatus[]

export default function AdminOrdersPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredOrders = useMemo(() => {
    return ORDERS.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (!search) return true
      const keyword = search.toLowerCase()
      return (
        order.code.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword) ||
        order.customerEmail.toLowerCase().includes(keyword)
      )
    })
  }, [search, statusFilter])

  const statusFilterOptions = [
    { value: 'all', label: t('admin.orders.filterAll') },
    ...ORDER_STATUS_FILTER_VALUES.map((status) => ({
      value: status,
      label: t(`status.order.${status}`),
    })),
  ]

  const columns = [
    {
      title: t('admin.orders.columns.code'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <span className="font-mono font-semibold text-slate-900">{code}</span>
      ),
    },
    {
      title: t('admin.orders.columns.customer'),
      key: 'customer',
      render: (_: unknown, order: Order) => (
        <div className="flex items-center gap-2">
          <img
            src={order.customerAvatar}
            alt={order.customerName}
            className="size-9 rounded-xl object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{order.customerName}</p>
            <p className="text-xs text-slate-500">{order.customerEmail}</p>
          </div>
        </div>
      ),
    },
    {
      title: t('admin.orders.columns.items'),
      key: 'items',
      render: (_: unknown, order: Order) => (
        <span className="text-slate-600">
          {t('admin.orders.columns.itemsCount', { count: order.items.length })}
        </span>
      ),
    },
    {
      title: t('admin.orders.columns.total'),
      key: 'total',
      render: (_: unknown, order: Order) => (
        <span className="font-bold text-fuchsia-600">{formatCurrency(order.total)}</span>
      ),
    },
    {
      title: t('admin.orders.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => <OrderStatusBadge status={status} />,
    },
    {
      title: t('admin.orders.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span className="text-slate-500">{formatDateTime(createdAt)}</span>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <Button variant="ghost" size="sm">
          {t('admin.orders.detail')}
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow={t('admin.orders.eyebrow')}
        title={
          <>
            {t('admin.orders.title')}{' '}
            <span className="text-gradient">{t('admin.orders.titleHighlight')}</span>
          </>
        }
        description={t('admin.orders.description')}
        actions={
          <Button variant="outline" leftIcon={<Download className="size-4" />}>
            {t('admin.orders.exportCsv')}
          </Button>
        }
      />

      <div className="glass mb-6 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center">
        <Input
          prefix={<Search className="size-4 text-slate-400" />}
          placeholder={t('admin.orders.searchPlaceholder')}
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
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredOrders}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  )
}
