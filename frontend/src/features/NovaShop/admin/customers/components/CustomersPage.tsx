import { useMemo, useState } from 'react'
import { Input, Select, Table } from 'antd'
import { Mail, Search, UserPlus } from 'lucide-react'
import { CUSTOMERS } from '../../../shared/data/customers'
import { formatCurrency, formatDate } from '../../../shared/format'
import type { Customer } from '../../../shared/types'
import Badge from '../../../shared/ui/Badge'
import Button from '../../../shared/ui/Button'
import AdminPageHeader from '../../layout/components/AdminPageHeader'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredCustomers = useMemo(() => {
    return CUSTOMERS.filter((customer) => {
      if (statusFilter !== 'all' && customer.status !== statusFilter) return false
      if (!search) return true
      const keyword = search.toLowerCase()
      return (
        customer.name.toLowerCase().includes(keyword) ||
        customer.email.toLowerCase().includes(keyword) ||
        customer.phone.includes(keyword)
      )
    })
  }, [search, statusFilter])

  const columns = [
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: unknown, customer: Customer) => (
        <div className="flex items-center gap-3">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="size-11 rounded-2xl object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{customer.name}</p>
            <p className="text-xs text-slate-500">{customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Đơn hàng',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (totalOrders: number) => (
        <span className="font-semibold text-slate-800">{totalOrders}</span>
      ),
    },
    {
      title: 'Chi tiêu',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (totalSpent: number) => (
        <span className="font-bold text-fuchsia-600">{formatCurrency(totalSpent)}</span>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (joinedAt: string) => formatDate(joinedAt),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Customer['status']) => (
        <Badge tone={status === 'active' ? 'emerald' : 'rose'} dot>
          {status === 'active' ? 'Hoạt động' : 'Ngưng'}
        </Badge>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <Button variant="ghost" size="sm" leftIcon={<Mail className="size-4" />}>
          Liên hệ
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow="Quản lý khách hàng"
        title={
          <>
            Khách hàng <span className="text-gradient">thân thiết</span>
          </>
        }
        description="Theo dõi hành vi mua sắm và thông tin liên hệ khách hàng."
        actions={
          <Button leftIcon={<UserPlus className="size-4" />}>Thêm khách hàng</Button>
        }
      />

      <div className="glass mb-6 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center">
        <Input
          prefix={<Search className="size-4 text-slate-400" />}
          placeholder="Tìm tên, email hoặc số điện thoại…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:flex-1"
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-44"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'active', label: 'Hoạt động' },
            { value: 'inactive', label: 'Ngưng hoạt động' },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredCustomers}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 960 }}
        />
      </div>
    </div>
  )
}
