import { useState } from 'react'
import { ChevronRight, Package, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PATHS, productDetailPath } from '@/router/paths'
import { CUSTOMER_ORDER_TABS } from '../constants/orders.constants'
import { ORDERS } from '../../../shared/data/orders'
import type { OrderStatus } from '../../../shared/types'
import { formatCurrency, formatDateTime } from '../../../shared/format'
import EmptyState from '../../../shared/ui/EmptyState'
import { OrderStatusBadge } from '../../../shared/ui/StatusBadge'
import { cx } from '../../../shared/ui/cx'

export default function OrdersPage() {
  const [tab, setTab] = useState<'all' | OrderStatus>('all')
  const [search, setSearch] = useState<string>('')

  const filtered = ORDERS.filter((order) => {
    if (tab !== 'all' && order.status !== tab) return false
    if (
      search &&
      !order.code.toLowerCase().includes(search.toLowerCase()) &&
      !order.items.some((item) =>
        item.productName.toLowerCase().includes(search.toLowerCase()),
      )
    )
      return false
    return true
  })

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          Lịch sử đặt hàng
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Đơn hàng <span className="text-gradient">của tôi</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Theo dõi và quản lý các đơn hàng đã đặt
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/85 p-3 backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="flex gap-1 overflow-x-auto sm:flex-1">
          {CUSTOMER_ORDER_TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              className={cx(
                'whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-bold transition-all',
                tab === entry.id
                  ? 'bg-linear-to-r from-fuchsia-500 to-purple-500 text-white shadow-md shadow-fuchsia-500/30'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 sm:w-64">
          <Search className="size-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm mã đơn hoặc sản phẩm…"
            className="h-10 flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="size-7" />}
          title="Chưa có đơn hàng"
          description="Bạn chưa có đơn hàng nào trong mục này. Hãy bắt đầu mua sắm nào!"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <article
              key={order.id}
              className="rounded-3xl border border-white/60 bg-white/85 p-5 backdrop-blur-xl transition-all hover:shadow-lg"
            >
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Mã đơn
                  </p>
                  <p className="font-mono text-sm font-bold text-slate-900">
                    {order.code}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
                <p className="text-xs text-slate-500">
                  Đặt lúc {formatDateTime(order.createdAt)}
                </p>
              </header>

              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Link
                      to={productDetailPath(item.productId)}
                      className="size-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="size-full object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={productDetailPath(item.productId)}
                        className="font-bold text-slate-900 hover:text-fuchsia-600"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-xs text-slate-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
                <div className="text-sm">
                  <span className="text-slate-500">Tổng tiền: </span>
                  <span className="text-lg font-extrabold tracking-tight text-gradient">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <Link
                  to={PATHS.ORDERS}
                  className="inline-flex items-center gap-1 text-sm font-bold text-fuchsia-600 hover:underline"
                >
                  Xem chi tiết <ChevronRight className="size-3.5" />
                </Link>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
