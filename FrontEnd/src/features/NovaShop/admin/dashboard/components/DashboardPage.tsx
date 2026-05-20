import { Line } from '@ant-design/charts'
import { ArrowUpRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import { ANALYTICS } from '../../../shared/data/analytics'
import { ORDERS } from '../../../shared/data/orders'
import { formatCurrency, formatDateTime } from '../../../shared/format'
import Button from '../../../shared/ui/Button'
import { OrderStatusBadge } from '../../../shared/ui/StatusBadge'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
import StatCard from '../../layout/components/StatCard'
import {
  DASHBOARD_ACTIVITY,
  DASHBOARD_STATS,
} from '../constants/dashboard.constants'

const chartData = ANALYTICS.slice(-6).flatMap((point) => [
  { month: point.month, value: point.revenue / 1_000_000, type: 'Doanh thu (triệu)' },
  { month: point.month, value: point.orders, type: 'Đơn hàng' },
])

export default function DashboardPage() {
  const recentOrders = ORDERS.slice(0, 5)

  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow="Bảng điều khiển"
        title={
          <>
            Xin chào, <span className="text-gradient">Admin</span>
          </>
        }
        description="Tổng quan hoạt động cửa hàng NovaShop trong thời gian thực."
        actions={
          <>
            <Link to={PATHS.ADMIN_PRODUCTS}>
              <Button variant="outline" size="sm" leftIcon={<Plus className="size-4" />}>
                Thêm sản phẩm
              </Button>
            </Link>
            <Link to={PATHS.ADMIN_ANALYTICS}>
              <Button size="sm" rightIcon={<ArrowUpRight className="size-4" />}>
                Xem phân tích
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            icon={<stat.icon className="size-5" />}
            tone={stat.tone}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <section className="glass-dark rounded-3xl p-6 ring-1 ring-white/10 xl:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Doanh thu & đơn hàng</h2>
              <p className="text-sm text-slate-400">6 tháng gần nhất</p>
            </div>
          </div>
          <Line
            data={chartData}
            xField="month"
            yField="value"
            colorField="type"
            height={280}
            smooth
            axis={{
              x: { labelFill: '#94a3b8', lineStroke: '#334155' },
              y: { labelFill: '#94a3b8', gridStroke: '#1e293b' },
            }}
            legend={{ color: { itemLabelFill: '#cbd5e1' } }}
          />
        </section>

        <section className="glass-dark rounded-3xl p-6 ring-1 ring-white/10 xl:col-span-4">
          <h2 className="text-lg font-bold text-white">Hoạt động gần đây</h2>
          <ul className="mt-5 space-y-4">
            {DASHBOARD_ACTIVITY.map((activity) => (
              <li key={activity.id} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-fuchsia-400" />
                <div>
                  <p className="text-sm text-slate-200">{activity.text}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="glass-dark mt-6 rounded-3xl p-6 ring-1 ring-white/10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Đơn hàng mới nhất</h2>
            <p className="text-sm text-slate-400">5 đơn gần nhất cần theo dõi</p>
          </div>
          <Link to={PATHS.ADMIN_ORDERS}>
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="size-4" />}>
              Xem tất cả
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4 font-semibold">Mã đơn</th>
                <th className="pb-3 pr-4 font-semibold">Khách hàng</th>
                <th className="pb-3 pr-4 font-semibold">Tổng tiền</th>
                <th className="pb-3 pr-4 font-semibold">Trạng thái</th>
                <th className="pb-3 font-semibold">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 last:border-0">
                  <td className="py-4 pr-4 font-mono font-semibold text-white">
                    {order.code}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={order.customerAvatar}
                        alt={order.customerName}
                        className="size-8 rounded-xl object-cover"
                      />
                      <span className="text-slate-200">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-bold text-fuchsia-300">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-4 pr-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-4 text-slate-400">
                    {formatDateTime(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
