import { useState } from 'react'
import { Input } from 'antd'
import { AlertTriangle, PackagePlus, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PRODUCTS } from '@/features/NovaShop/shared/data/products'
import { formatNumber } from '@/features/NovaShop/shared/format'
import type { Product } from '@/features/NovaShop/shared/types'
import Button from '@/features/NovaShop/shared/ui/Button'
import { ProductStatusBadge } from '@/features/NovaShop/shared/ui/StatusBadge'
import AdminListPage from '../../layout/components/AdminListPage'
import AdminTable from '../../layout/components/AdminTable'
import StatCard from '../../layout/components/StatCard'
import { adminTableAvatarLg, adminTableText } from '../../layout/constants/adminTableStyles'

const LOW_STOCK_THRESHOLD = 20

export default function InventoryPage() {
  const { t: translate } = useTranslation()
  const [search, setSearch] = useState('')

  const inventoryProducts = PRODUCTS.filter((product) => {
    if (!search) return true
    const keyword = search.toLowerCase()
    return (
      product.name.toLowerCase().includes(keyword) ||
      product.sku.toLowerCase().includes(keyword)
    )
  }).sort((left, right) => left.stock - right.stock)

  const lowStockCount = PRODUCTS.filter(
    (product) => product.stock <= LOW_STOCK_THRESHOLD,
  ).length
  const outOfStockCount = PRODUCTS.filter(
    (product) => product.status === 'out_of_stock' || product.stock === 0,
  ).length
  const totalStock = PRODUCTS.reduce((sum, product) => sum + product.stock, 0)

  const columns = [
    {
      title: translate('admin.inventory.columns.product'),
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
      title: translate('admin.inventory.columns.stock'),
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <span className={stock <= LOW_STOCK_THRESHOLD ? adminTableText.danger : adminTableText.emphasis}>
          {stock}
        </span>
      ),
    },
    {
      title: translate('admin.inventory.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: Product['status']) => <ProductStatusBadge status={status} />,
    },
    {
      title: translate('admin.inventory.columns.alert'),
      key: 'alert',
      render: (_: unknown, product: Product) =>
        product.stock <= LOW_STOCK_THRESHOLD ? (
          <span className={adminTableText.warning}>
            <AlertTriangle className="size-3.5" /> {translate('admin.inventory.columns.lowStock')}
          </span>
        ) : (
          <span className={adminTableText.muted}>{translate('admin.inventory.columns.stable')}</span>
        ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <Button variant="ghost" size="sm" leftIcon={<PackagePlus className="size-4" />}>
          {translate('admin.inventory.restock')}
        </Button>
      ),
    },
  ]

  return (
    <AdminListPage
      eyebrow={translate('admin.inventory.eyebrow')}
      title={translate('admin.inventory.title')}
      titleHighlight={translate('admin.inventory.titleHighlight')}
      description={translate('admin.inventory.description')}
      actions={
        <Button leftIcon={<PackagePlus className="size-4" />}>
          {translate('admin.inventory.import')}
        </Button>
      }
      summary={
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label={translate('admin.inventory.stats.totalStock')}
            value={formatNumber(totalStock)}
            icon={<PackagePlus className="size-5" />}
            tone="cyan"
          />
          <StatCard
            label={translate('admin.inventory.stats.lowStock')}
            value={formatNumber(lowStockCount)}
            icon={<AlertTriangle className="size-5" />}
            tone="amber"
          />
          <StatCard
            label={translate('admin.inventory.stats.outOfStock')}
            value={formatNumber(outOfStockCount)}
            icon={<AlertTriangle className="size-5" />}
            tone="rose"
          />
        </div>
      }
      toolbar={
        <Input
          prefix={<Search className="size-4 text-slate-400" />}
          placeholder={translate('admin.inventory.searchPlaceholder')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          allowClear
        />
      }
    >
      <AdminTable rowKey="id" columns={columns} dataSource={inventoryProducts} scroll={{ x: 800 }} />
    </AdminListPage>
  )
}
