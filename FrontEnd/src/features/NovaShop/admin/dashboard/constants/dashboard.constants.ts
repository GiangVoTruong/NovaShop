import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react'
import { formatCurrency, formatNumber } from '../../../shared/format'
import { CUSTOMERS } from '../../../shared/data/customers'
import { ORDERS } from '../../../shared/data/orders'
import { PRODUCTS } from '../../../shared/data/products'

const totalRevenue = ORDERS.reduce((sum, order) => sum + order.total, 0)
const pendingOrders = ORDERS.filter((order) => order.status === 'pending').length
const activeProducts = PRODUCTS.filter((product) => product.status === 'active').length

export const DASHBOARD_STATS = [
  {
    label: 'Doanh thu tháng này',
    value: formatCurrency(412000000),
    change: '+12.4%',
    icon: DollarSign,
    tone: 'fuchsia' as const,
  },
  {
    label: 'Đơn hàng',
    value: formatNumber(ORDERS.length),
    change: '+8.2%',
    icon: ShoppingCart,
    tone: 'cyan' as const,
  },
  {
    label: 'Khách hàng',
    value: formatNumber(CUSTOMERS.length),
    change: '+5.1%',
    icon: Users,
    tone: 'indigo' as const,
  },
  {
    label: 'Sản phẩm đang bán',
    value: formatNumber(activeProducts),
    change: `${pendingOrders} chờ xử lý`,
    icon: Package,
    tone: 'emerald' as const,
  },
]

export const DASHBOARD_ACTIVITY = [
  {
    id: '1',
    text: 'Đơn NS-2026-00132 vừa được xác nhận',
    time: '2 phút trước',
  },
  {
    id: '2',
    text: 'Sản phẩm "Tai nghe Nova Pro Max" sắp hết hàng (còn 42)',
    time: '15 phút trước',
  },
  {
    id: '3',
    text: 'Khách hàng mới: Đỗ Khánh Linh',
    time: '1 giờ trước',
  },
  {
    id: '4',
    text: `Doanh thu tuần đạt ${formatCurrency(totalRevenue)}`,
    time: '3 giờ trước',
  },
]
