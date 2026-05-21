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
    labelKey: 'admin.dashboard.stats.monthlyRevenue',
    value: formatCurrency(412000000),
    change: '+12.4%',
    icon: DollarSign,
    tone: 'fuchsia' as const,
  },
  {
    labelKey: 'admin.dashboard.stats.orders',
    value: formatNumber(ORDERS.length),
    change: '+8.2%',
    icon: ShoppingCart,
    tone: 'cyan' as const,
  },
  {
    labelKey: 'admin.dashboard.stats.customers',
    value: formatNumber(CUSTOMERS.length),
    change: '+5.1%',
    icon: Users,
    tone: 'indigo' as const,
  },
  {
    labelKey: 'admin.dashboard.stats.activeProducts',
    value: formatNumber(activeProducts),
    changeKey: 'admin.dashboard.stats.pendingSuffix',
    changeParams: { count: pendingOrders },
    icon: Package,
    tone: 'emerald' as const,
  },
] as const

export const DASHBOARD_ACTIVITY = [
  {
    id: '1',
    textKey: 'admin.dashboard.activity.items.orderConfirmed',
    timeKey: 'admin.dashboard.activity.time.minutesAgo',
    timeParams: { count: 2 },
  },
  {
    id: '2',
    textKey: 'admin.dashboard.activity.items.lowStock',
    timeKey: 'admin.dashboard.activity.time.minutesAgo',
    timeParams: { count: 15 },
  },
  {
    id: '3',
    textKey: 'admin.dashboard.activity.items.newCustomer',
    timeKey: 'admin.dashboard.activity.time.hourAgo',
  },
  {
    id: '4',
    textKey: 'admin.dashboard.activity.items.weeklyRevenue',
    textParams: { amount: formatCurrency(totalRevenue) },
    timeKey: 'admin.dashboard.activity.time.hoursAgo',
    timeParams: { count: 3 },
  },
] as const
