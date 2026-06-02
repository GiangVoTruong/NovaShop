import { useState } from 'react'
import { Input, Select, Spin } from 'antd'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/features/NovaShop/shared/format'
import type { AdminUser } from '@/types/admin.types'
import Badge from '@/features/NovaShop/shared/ui/Badge'
import AdminListPage from '../../layout/components/AdminListPage'
import AdminTable from '../../layout/components/AdminTable'
import { adminTableText } from '../../layout/constants/adminTableStyles'
import { useAdminUsers } from '../../hooks/useAdminUsers'

export default function CustomersPage() {
  const { t: translate } = useTranslation()
  const usersQuery = useAdminUsers()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const filteredCustomers = (usersQuery.data ?? []).filter((customer) => {
    if (roleFilter !== 'all' && customer.role !== roleFilter) {
      return false
    }
    if (!search) {
      return true
    }
    const keyword = search.toLowerCase()
    return (
      customer.fullName.toLowerCase().includes(keyword) ||
      customer.email.toLowerCase().includes(keyword) ||
      customer.phone.includes(keyword)
    )
  })

  const roleFilterOptions = [
    { value: 'all', label: translate('admin.customers.filterAll') },
    { value: 'CUSTOMER', label: translate('admin.customers.filterCustomer') },
    { value: 'SELLER', label: translate('admin.customers.filterSeller') },
    { value: 'ADMIN', label: translate('admin.customers.filterAdmin') },
  ]

  const columns = [
    {
      title: translate('admin.customers.columns.customer'),
      key: 'customer',
      render: (_: unknown, customer: AdminUser) => (
        <div>
          <p className={adminTableText.primary}>{customer.fullName}</p>
          <p className={adminTableText.secondary}>{customer.email}</p>
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
      title: translate('admin.customers.columns.role'),
      dataIndex: 'role',
      key: 'role',
      render: (role: AdminUser['role']) => (
        <span className={adminTableText.body}>{role}</span>
      ),
    },
    {
      title: translate('admin.customers.columns.joinedAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span className={adminTableText.muted}>{formatDate(createdAt)}</span>
      ),
    },
    {
      title: translate('admin.customers.columns.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Badge tone={isActive ? 'emerald' : 'rose'} dot>
          {translate(isActive ? 'status.customer.active' : 'status.customer.inactive')}
        </Badge>
      ),
    },
  ]

  if (usersQuery.isLoading) {
    return (
      <AdminListPage
        eyebrow={translate('admin.customers.eyebrow')}
        title={translate('admin.customers.title')}
        titleHighlight={translate('admin.customers.titleHighlight')}
        description={translate('admin.customers.description')}
      >
        <div className="flex min-h-40 items-center justify-center">
          <Spin size="large" />
        </div>
      </AdminListPage>
    )
  }

  return (
    <AdminListPage
      eyebrow={translate('admin.customers.eyebrow')}
      title={translate('admin.customers.title')}
      titleHighlight={translate('admin.customers.titleHighlight')}
      description={translate('admin.customers.description')}
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
            value={roleFilter}
            onChange={setRoleFilter}
            className="w-full sm:w-44"
            options={roleFilterOptions}
          />
        </>
      }
    >
      <AdminTable rowKey="id" columns={columns} dataSource={filteredCustomers} scroll={{ x: 960 }} />
    </AdminListPage>
  )
}
