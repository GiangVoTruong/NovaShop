import { useState } from 'react'
import { Input, Select, Spin } from 'antd'
import { Plus, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getProductImages, getProductSalePrice } from '@/features/NovaShop/customer/catalog/lib/productApi'
import { formatCurrency } from '@/features/NovaShop/shared/format'
import type { ApiProductResponse } from '@/types/product.types'
import Button from '@/features/NovaShop/shared/ui/Button'
import AdminListPage from '../../layout/components/AdminListPage'
import AdminTable from '../../layout/components/AdminTable'
import { adminTableAvatarLg, adminTableText } from '../../layout/constants/adminTableStyles'
import { useAdminProducts } from '../../hooks/useAdminCatalog'

const PRODUCT_STATUS_FILTER_VALUES = ['ACTIVE', 'INACTIVE', 'DELETED'] as const

export default function ProductsPage() {
  const { t: translate } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const productsQuery = useAdminProducts({ keyword: search || undefined, size: 100 })

  const products = productsQuery.data?.data ?? []

  const filteredProducts = products.filter((product) => {
    if (statusFilter !== 'all' && product.status !== statusFilter) {
      return false
    }
    return true
  })

  const statusFilterOptions = [
    { value: 'all', label: translate('admin.products.filterAll') },
    ...PRODUCT_STATUS_FILTER_VALUES.map((status) => ({
      value: status,
      label: status,
    })),
  ]

  const columns = [
    {
      title: translate('admin.products.columns.product'),
      key: 'product',
      render: (_: unknown, product: ApiProductResponse) => (
        <div className="flex items-center gap-3">
          <img
            src={getProductImages(product)[0]}
            alt={product.name}
            className={adminTableAvatarLg}
          />
          <div>
            <p className={adminTableText.primary}>{product.name}</p>
            <p className={adminTableText.secondary}>{product.slug}</p>
          </div>
        </div>
      ),
    },
    {
      title: translate('admin.products.columns.category'),
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (categoryName: string) => (
        <span className={adminTableText.body}>{categoryName}</span>
      ),
    },
    {
      title: translate('admin.products.columns.price'),
      key: 'price',
      render: (_: unknown, product: ApiProductResponse) => (
        <span className={adminTableText.money}>{formatCurrency(getProductSalePrice(product))}</span>
      ),
    },
    {
      title: translate('admin.products.columns.stock'),
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <span className={stock <= 20 ? adminTableText.danger : adminTableText.body}>{stock}</span>
      ),
    },
    {
      title: translate('admin.products.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: ApiProductResponse['status']) => (
        <span className={adminTableText.body}>{status}</span>
      ),
    },
  ]

  if (productsQuery.isLoading) {
    return (
      <AdminListPage
        eyebrow={translate('admin.products.eyebrow')}
        title={translate('admin.products.title')}
        titleHighlight={translate('admin.products.titleHighlight')}
        description={translate('admin.products.description')}
      >
        <div className="flex min-h-40 items-center justify-center">
          <Spin size="large" />
        </div>
      </AdminListPage>
    )
  }

  return (
    <AdminListPage
      eyebrow={translate('admin.products.eyebrow')}
      title={translate('admin.products.title')}
      titleHighlight={translate('admin.products.titleHighlight')}
      description={translate('admin.products.description')}
      actions={
        <Button leftIcon={<Plus className="size-4" />} disabled>
          {translate('admin.products.add')}
        </Button>
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
