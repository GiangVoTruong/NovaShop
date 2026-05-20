import { useMemo, useState } from 'react'
import { Input, Table } from 'antd'
import { AlertTriangle, PackagePlus, Search } from 'lucide-react'
import { PRODUCTS } from '../../../shared/data/products'
import { formatNumber } from '../../../shared/format'
import type { Product } from '../../../shared/types'
import Button from '../../../shared/ui/Button'
import { ProductStatusBadge } from '../../../shared/ui/StatusBadge'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
import StatCard from '../../layout/components/StatCard'

const LOW_STOCK_THRESHOLD = 20

export default function InventoryPage() {
  const [search, setSearch] = useState('')

  const inventoryProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (!search) return true
      const keyword = search.toLowerCase()
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword)
      )
    }).sort((left, right) => left.stock - right.stock)
  }, [search])

  const lowStockCount = PRODUCTS.filter(
    (product) => product.stock <= LOW_STOCK_THRESHOLD,
  ).length
  const outOfStockCount = PRODUCTS.filter(
    (product) => product.status === 'out_of_stock' || product.stock === 0,
  ).length
  const totalStock = PRODUCTS.reduce((sum, product) => sum + product.stock, 0)

  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_: unknown, product: Product) => (
        <div className="flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="size-11 rounded-xl object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{product.name}</p>
            <p className="text-xs text-slate-500">{product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <span
          className={
            stock <= LOW_STOCK_THRESHOLD
              ? 'font-bold text-rose-500'
              : 'font-semibold text-slate-800'
          }
        >
          {stock}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Product['status']) => <ProductStatusBadge status={status} />,
    },
    {
      title: 'Cảnh báo',
      key: 'alert',
      render: (_: unknown, product: Product) =>
        product.stock <= LOW_STOCK_THRESHOLD ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
            <AlertTriangle className="size-3.5" /> Sắp hết
          </span>
        ) : (
          <span className="text-xs text-slate-400">Ổn định</span>
        ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <Button variant="ghost" size="sm" leftIcon={<PackagePlus className="size-4" />}>
          Nhập kho
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow="Quản lý kho"
        title={
          <>
            Kho hàng <span className="text-gradient">& tồn kho</span>
          </>
        }
        description="Theo dõi mức tồn kho và cảnh báo sản phẩm sắp hết hàng."
        actions={
          <Button leftIcon={<PackagePlus className="size-4" />}>Nhập kho mới</Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Tổng tồn kho"
          value={formatNumber(totalStock)}
          icon={<PackagePlus className="size-5" />}
          tone="cyan"
        />
        <StatCard
          label="Sắp hết hàng"
          value={formatNumber(lowStockCount)}
          icon={<AlertTriangle className="size-5" />}
          tone="amber"
        />
        <StatCard
          label="Hết hàng"
          value={formatNumber(outOfStockCount)}
          icon={<AlertTriangle className="size-5" />}
          tone="rose"
        />
      </div>

      <div className="glass mb-6 rounded-3xl p-4">
        <Input
          prefix={<Search className="size-4 text-slate-400" />}
          placeholder="Tìm sản phẩm hoặc SKU…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          allowClear
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={inventoryProducts}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  )
}
