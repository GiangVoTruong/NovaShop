import { useState } from 'react'
import { Input, Select } from 'antd'
import { Mail, Search, UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CUSTOMERS } from '@/features/NovaShop/shared/data/customers'
import { formatCurrency, formatDate } from '@/features/NovaShop/shared/format'
import type { Customer } from '@/features/NovaShop/shared/types'
import Badge from '@/features/NovaShop/shared/ui/Badge'
import Button from '@/features/NovaShop/shared/ui/Button'
import AdminListPage from '../../layout/components/AdminListPage'
import AdminTable from '../../layout/components/AdminTable'
import { adminTableAvatarLg, adminTableText } from '../../layout/constants/adminTableStyles'

const CUSTOMER_STATUS_FILTER_VALUES = ['active', 'inactive'] as const

export default function CustomersPage() {
  const { t: translate } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredCustomers = CUSTOMERS.filter((customer) => {
    if (statusFilter !== 'all' && customer.status !== statusFilter) return false
    if (!search) return true
    const keyword = search.toLowerCase()
    return (
      customer.name.toLowerCase().includes(keyword) ||
      customer.email.toLowerCase().includes(keyword) ||
      customer.phone.includes(keyword)
    )
  })

  const statusFilterOptions = [
    { value: 'all', label: translate('admin.customers.filterAll') },
    ...CUSTOMER_STATUS_FILTER_VALUES.map((status) => ({
      value: status,
      label:
        status === 'inactive'
          ? translate('status.customer.inactiveFull')
          : translate(`status.customer.${status}`),
    })),
  ]

  const columns = [
    {
      title: translate('admin.customers.columns.customer'),
      key: 'customer',
      render: (_: unknown, customer: Customer) => (
        <div className="flex items-center gap-3">
          <img src={customer.avatar} alt={customer.name} className={adminTableAvatarLg} />
          <div>
            <p className={adminTableText.primary}>{customer.name}</p>
            <p className={adminTableText.secondary}>{customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: translate('admin.customers.columns.phone'),
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => <span className={adminTableText.body}>{phone}</span>,
    },
    {
      title: translate('admin.customers.columns.orders'),
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (totalOrders: number) => (
        <span className={adminTableText.emphasis}>{totalOrders}</span>
      ),
    },
    {
      title: translate('admin.customers.columns.spent'),
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (totalSpent: number) => (
        <span className={adminTableText.money}>{formatCurrency(totalSpent)}</span>
      ),
    },
    {
      title: translate('admin.customers.columns.joinedAt'),
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (joinedAt: string) => (
        <span className={adminTableText.muted}>{formatDate(joinedAt)}</span>
      ),
    },
    {
      title: translate('admin.customers.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: Customer['status']) => (
        <Badge tone={status === 'active' ? 'emerald' : 'rose'} dot>
          {translate(`status.customer.${status}`)}
        </Badge>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <Button variant="ghost" size="sm" leftIcon={<Mail className="size-4" />}>
          {translate('admin.customers.contact')}
        </Button>
      ),
    },
  ]

  return (
    <AdminListPage
      eyebrow={translate('admin.customers.eyebrow')}
      title={translate('admin.customers.title')}
      titleHighlight={translate('admin.customers.titleHighlight')}
      description={translate('admin.customers.description')}
      actions={
        <Button leftIcon={<UserPlus className="size-4" />}>{translate('admin.customers.add')}</Button>
      }
      toolbar={
        <>
          <Input
            prefix={<Search className="size-4 text-slate-400" />}
            placeholder={translate('admin.customers.searchPlaceholder')}
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
        </>
      }
    >
      <AdminTable rowKey="id" columns={columns} dataSource={filteredCustomers} scroll={{ x: 960 }} />
    </AdminListPage>
  )
}
