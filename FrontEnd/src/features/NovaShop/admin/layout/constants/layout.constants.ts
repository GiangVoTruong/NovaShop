import {
  BarChart3,
  FolderTree,
  LayoutDashboard,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  Users,
  Warehouse,
} from 'lucide-react'
import { PATHS } from '@/router/paths'

export const ADMIN_NAV_ITEMS = [
  { label: 'Tổng quan', path: PATHS.ADMIN, icon: LayoutDashboard },
  { label: 'Sản phẩm', path: PATHS.ADMIN_PRODUCTS, icon: ShoppingBag },
  { label: 'Đơn hàng', path: PATHS.ADMIN_ORDERS, icon: Package },
  { label: 'Khách hàng', path: PATHS.ADMIN_CUSTOMERS, icon: Users },
  { label: 'Danh mục', path: PATHS.ADMIN_CATEGORIES, icon: FolderTree },
  { label: 'Kho hàng', path: PATHS.ADMIN_INVENTORY, icon: Warehouse },
  { label: 'Mã giảm giá', path: PATHS.ADMIN_COUPONS, icon: Percent },
  { label: 'Phân tích', path: PATHS.ADMIN_ANALYTICS, icon: BarChart3 },
  { label: 'Cài đặt', path: PATHS.ADMIN_SETTINGS, icon: Settings },
] as const

export const ADMIN_QUICK_STATS = [
  { label: 'Đơn chờ xử lý', value: '12', tone: 'amber' },
  { label: 'Sắp hết hàng', value: '5', tone: 'rose' },
  { label: 'Doanh thu hôm nay', value: '48.2M', tone: 'emerald' },
] as const
