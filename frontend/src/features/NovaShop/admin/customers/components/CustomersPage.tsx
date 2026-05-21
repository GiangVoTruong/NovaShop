import { useMemo, useState } from 'react'
import { Input, Select, Table } from 'antd'
import { Mail, Search, UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CUSTOMERS } from '../../../shared/data/customers'
import { formatCurrency, formatDate } from '../../../shared/format'
import type { Customer } from '../../../shared/types'
import Badge from '../../../shared/ui/Badge'
import Button from '../../../shared/ui/Button'
import AdminPageHeader from '../../layout/components/AdminPageHeader'

const CUSTOMER_STATUS_FILTER_VALUES = ['active', 'inactive'] as const

export default function CustomersPage() {
  const { t } = useTranslation()
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

  const statusFilterOptions = [
    { value: 'all', label: t('admin.customers.filterAll') },
    ...CUSTOMER_STATUS_FILTER_VALUES.map((status) => ({
      value: status,
      label:
        status === 'inactive'
          ? t('status.customer.inactiveFull')
          : t(`status.customer.${status}`),
    })),
  ]

  const columns = [
    {
      title: t('admin.customers.columns.customer'),
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
      title: t('admin.customers.columns.phone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('admin.customers.columns.orders'),
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (totalOrders: number) => (
        <span className="font-semibold text-slate-800">{totalOrders}</span>
      ),
    },
    {
      title: t('admin.customers.columns.spent'),
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (totalSpent: number) => (
        <span className="font-bold text-fuchsia-600">{formatCurrency(totalSpent)}</span>
      ),
    },
    {
      title: t('admin.customers.columns.joinedAt'),
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (joinedAt: string) => formatDate(joinedAt),
    },
    {
      title: t('admin.customers.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: Customer['status']) => (
        <Badge tone={status === 'active' ? 'emerald' : 'rose'} dot>
          {t(`status.customer.${status}`)}
        </Badge>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <Button variant="ghost" size="sm" leftIcon={<Mail className="size-4" />}>
          {t('admin.customers.contact')}
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow={t('admin.customers.eyebrow')}
        title={
          <>
            {t('admin.customers.title')}{' '}
            <span className="text-gradient">{t('admin.customers.titleHighlight')}</span>
          </>
        }
        description={t('admin.customers.description')}
        actions={
          <Button leftIcon={<UserPlus className="size-4" />}>{t('admin.customers.add')}</Button>
        }
      />

      <div className="glass mb-6 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center">
        <Input
          prefix={<Search className="size-4 text-slate-400" />}
          placeholder={t('admin.customers.searchPlaceholder')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:flex-1"
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-44"
          options={statusFilterOptions}
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
