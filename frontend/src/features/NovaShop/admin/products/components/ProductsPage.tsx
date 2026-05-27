import { useState } from 'react'
import { Input, Select } from 'antd'
import { Plus, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PRODUCTS } from '@/features/NovaShop/shared/data/products'
import { formatCurrency } from '@/features/NovaShop/shared/format'
import type { Product } from '@/features/NovaShop/shared/types'
import Button from '@/features/NovaShop/shared/ui/Button'
import { CategoryTag, ProductStatusBadge } from '@/features/NovaShop/shared/ui/StatusBadge'
import AdminListPage from '../../layout/components/AdminListPage'
import AdminTable from '../../layout/components/AdminTable'
import {
  adminTableAvatarLg,
  adminTableText,
} from '../../layout/constants/adminTableStyles'

const PRODUCT_STATUS_FILTER_VALUES = ['active', 'draft', 'out_of_stock'] as const

export default function ProductsPage() {
  const { t: translate } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredProducts = PRODUCTS.filter((product) => {
    if (statusFilter !== 'all' && product.status !== statusFilter) return false
    if (!search) return true
    const keyword = search.toLowerCase()
    return (
      product.name.toLowerCase().includes(keyword) ||
      product.sku.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword)
    )
  })

  const statusFilterOptions = [
    { value: 'all', label: translate('admin.products.filterAll') },
    ...PRODUCT_STATUS_FILTER_VALUES.map((status) => ({
      value: status,
      label: translate(`status.product.${status}`),
    })),
  ]

  const columns = [
    {
      title: translate('admin.products.columns.product'),
      key: 'product',
      render: (_: unknown, product: Product) => (
        <div className="flex items-center gap-3">
          <img src={product.images[0]} alt={product.name} className={adminTableAvatarLg} />
          <div>
            <p className={adminTableText.primary}>{product.name}</p>
            <p className={adminTableText.secondary}>{product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      title: translate('admin.products.columns.category'),
      dataIndex: 'category',
      key: 'category',
      render: (category: Product['category']) => <CategoryTag category={category} />,
    },
    {
      title: translate('admin.products.columns.price'),
      key: 'price',
      render: (_: unknown, product: Product) => (
        <span className={adminTableText.money}>{formatCurrency(product.price)}</span>
      ),
    },
    {
      title: translate('admin.products.columns.stock'),
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <span className={stock <= 20 ? adminTableText.danger : adminTableText.body}>
          {stock}
        </span>
      ),
    },
    {
      title: translate('admin.products.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: Product['status']) => <ProductStatusBadge status={status} />,
    },
    {
      title: translate('admin.products.columns.actions'),
      key: 'actions',
      render: () => (
        <Button variant="ghost" size="sm">
          {translate('admin.products.edit')}
        </Button>
      ),
    },
  ]

  return (
    <AdminListPage
      eyebrow={translate('admin.products.eyebrow')}
      title={translate('admin.products.title')}
      titleHighlight={translate('admin.products.titleHighlight')}
      description={translate('admin.products.description')}
      actions={
        <Button leftIcon={<Plus className="size-4" />}>{translate('admin.products.add')}</Button>
      }
      toolbar={
        <>
          <Input
            prefix={<Search className="size-4 text-slate-400" />}
            placeholder={translate('admin.products.searchPlaceholder')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:flex-1"
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full sm:w-48"
            options={statusFilterOptions}
          />
        </>
      }
    >
      <AdminTable rowKey="id" columns={columns} dataSource={filteredProducts} scroll={{ x: 900 }} />
    </AdminListPage>
  )
}
