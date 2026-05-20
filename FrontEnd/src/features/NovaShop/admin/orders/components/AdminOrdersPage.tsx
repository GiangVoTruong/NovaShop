import { useMemo, useState } from 'react'
import { Input, Select, Table } from 'antd'
import { Download, Search } from 'lucide-react'
import { ORDERS } from '../../../shared/data/orders'
import { formatCurrency, formatDateTime } from '../../../shared/format'
import type { Order, OrderStatus } from '../../../shared/types'
import Button from '../../../shared/ui/Button'
import { OrderStatusBadge } from '../../../shared/ui/StatusBadge'
import { ORDER_STATUS_LABEL } from '../../../shared/ui/statusBadge.constants'
import AdminPageHeader from '../../layout/components/AdminPageHeader'

export default function AdminOrdersPage() {
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

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <span className="font-mono font-semibold text-slate-900">{code}</span>
      ),
    },
    {
      title: 'Khách hàng',
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
      title: 'Sản phẩm',
      key: 'items',
      render: (_: unknown, order: Order) => (
        <span className="text-slate-600">{order.items.length} mặt hàng</span>
      ),
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      render: (_: unknown, order: Order) => (
        <span className="font-bold text-fuchsia-600">{formatCurrency(order.total)}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => <OrderStatusBadge status={status} />,
    },
    {
      title: 'Ngày đặt',
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
          Chi tiết
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow="Quản lý đơn hàng"
        title={
          <>
            Đơn hàng <span className="text-gradient">toàn cửa hàng</span>
          </>
        }
        description="Theo dõi, lọc và xử lý đơn hàng từ khách hàng."
        actions={
          <Button variant="outline" leftIcon={<Download className="size-4" />}>
            Xuất CSV
          </Button>
        }
      />

      <div className="glass mb-6 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center">
        <Input
          prefix={<Search className="size-4 text-slate-400" />}
          placeholder="Tìm mã đơn, tên hoặc email khách…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:flex-1"
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-52"
          options={[
            { value: 'all', label: 'Tất cả trạng thái' },
            ...Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
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
