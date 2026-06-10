import { formatNumber } from '@/features/NovaShop/shared/format'
import type { AdminInventoryItem } from '@/types/admin.types'
import Button from '@/features/NovaShop/shared/ui/Button'
import { Input, Spin } from 'antd'
import { AlertTriangle, PackagePlus, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAdminInventory, useAdminInventorySummary } from '../../hooks/useAdminInventory'
import AdminListPage from '../../layout/components/AdminListPage'
import AdminTable from '../../layout/components/AdminTable'
import StatCard from '../../layout/components/StatCard'
import { adminTableAvatarLg, adminTableText } from '../../layout/constants/adminTableStyles'

const LOW_STOCK_THRESHOLD = 20

export default function InventoryPage() {
  const { t: translate } = useTranslation()
  const [search, setSearch] = useState('')
  const inventoryQuery = useAdminInventory({
    keyword: search || undefined,
    size: 100,
    sortBy: 'stock',
    sortDir: 'asc',
  })
  const summaryQuery = useAdminInventorySummary()

  const inventoryProducts = inventoryQuery.data?.data ?? []
  const summary = summaryQuery.data

  const columns = [
    {
      title: translate('admin.inventory.columns.product'),
      key: 'product',
      render: (_: unknown, product: AdminInventoryItem) => (
        <div className="flex items-center gap-3">
          <img
            src={product.primaryImageUrl ?? 'https://via.placeholder.com/80'}
            alt={product.name}
            className={adminTableAvatarLg}
          />
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
        <span
          className={stock <= LOW_STOCK_THRESHOLD ? adminTableText.danger : adminTableText.emphasis}
        >
          {stock}
        </span>
      ),
    },
    {
      title: translate('admin.inventory.columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: AdminInventoryItem['status']) => (
        <span className={adminTableText.body}>{status}</span>
      ),
    },
    {
      title: translate('admin.inventory.columns.alert'),
      key: 'alert',
      render: (_: unknown, product: AdminInventoryItem) =>
        product.stock <= LOW_STOCK_THRESHOLD ? (
          <span className={adminTableText.warning}>
            <AlertTriangle className="size-3.5" /> {translate('admin.inventory.columns.lowStock')}
          </span>
        ) : (
          <span className={adminTableText.muted}>
            {translate('admin.inventory.columns.stable')}
          </span>
        ),
    },
  ]

  if (inventoryQuery.isLoading || summaryQuery.isLoading) {
    return (
      <AdminListPage
        eyebrow={translate('admin.inventory.eyebrow')}
        title={translate('admin.inventory.title')}
        titleHighlight={translate('admin.inventory.titleHighlight')}
        description={translate('admin.inventory.description')}
      >
        <div className="flex min-h-40 items-center justify-center">
          <Spin size="large" />
        </div>
      </AdminListPage>
    )
  }

  return (
    <AdminListPage
      eyebrow={translate('admin.inventory.eyebrow')}
      title={translate('admin.inventory.title')}
      titleHighlight={translate('admin.inventory.titleHighlight')}
      description={translate('admin.inventory.description')}
      actions={
        <Button variant="dark" leftIcon={<PackagePlus className="size-4" />} disabled>
          {translate('admin.inventory.import')}
        </Button>
      }
      summary={
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label={translate('admin.inventory.stats.totalStock')}
            value={formatNumber(summary?.totalUnitsInStock ?? 0)}
            icon={<PackagePlus className="size-5" />}
            tone="cyan"
          />
          <StatCard
            label={translate('admin.inventory.stats.lowStock')}
            value={formatNumber(summary?.lowStockCount ?? 0)}
            icon={<AlertTriangle className="size-5" />}
            tone="amber"
          />
          <StatCard
            label={translate('admin.inventory.stats.outOfStock')}
            value={formatNumber(summary?.outOfStockCount ?? 0)}
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
      <AdminTable
        rowKey="productId"
        columns={columns}
        dataSource={inventoryProducts}
        scroll={{ x: 800 }}
      />
    </AdminListPage>
  )
}
