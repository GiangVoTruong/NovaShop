import { useMemo, useState } from 'react'
import { Input, Select, Table } from 'antd'
import { Plus, Search } from 'lucide-react'
import { PRODUCTS } from '../../../shared/data/products'
import { formatCurrency } from '../../../shared/format'
import type { Product } from '../../../shared/types'
import Button from '../../../shared/ui/Button'
import { CategoryTag, ProductStatusBadge } from '../../../shared/ui/StatusBadge'
import AdminPageHeader from '../../layout/components/AdminPageHeader'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (statusFilter !== 'all' && product.status !== statusFilter) return false
      if (!search) return true
      const keyword = search.toLowerCase()
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword)
      )
    })
  }, [search, statusFilter])

  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_: unknown, product: Product) => (
        <div className="flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="size-12 rounded-xl object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{product.name}</p>
            <p className="text-xs text-slate-500">{product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: Product['category']) => <CategoryTag category={category} />,
    },
    {
      title: 'Giá',
      key: 'price',
      render: (_: unknown, product: Product) => (
        <span className="font-bold text-fuchsia-600">{formatCurrency(product.price)}</span>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <span className={stock <= 20 ? 'font-bold text-rose-500' : 'text-slate-700'}>
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
      title: 'Thao tác',
      key: 'actions',
      render: () => (
        <Button variant="ghost" size="sm">
          Sửa
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow="Quản lý sản phẩm"
        title={
          <>
            Sản phẩm <span className="text-gradient">NovaShop</span>
          </>
        }
        description="Quản lý danh sách sản phẩm, giá bán và trạng thái hiển thị."
        actions={
          <Button leftIcon={<Plus className="size-4" />}>Thêm sản phẩm</Button>
        }
      />

      <div className="glass mb-6 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center">
        <Input
          prefix={<Search className="size-4 text-slate-400" />}
          placeholder="Tìm theo tên, SKU, thương hiệu…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:flex-1"
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-48"
          options={[
            { value: 'all', label: 'Tất cả trạng thái' },
            { value: 'active', label: 'Đang bán' },
            { value: 'draft', label: 'Bản nháp' },
            { value: 'out_of_stock', label: 'Hết hàng' },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredProducts}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  )
}
