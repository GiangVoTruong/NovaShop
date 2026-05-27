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

export const ADMIN_NAV_SECTIONS = [
  {
    labelKey: 'admin.nav.sectionOverview',
    items: [
      { labelKey: 'admin.nav.dashboard', path: PATHS.ADMIN, icon: LayoutDashboard },
      { labelKey: 'admin.nav.analytics', path: PATHS.ADMIN_ANALYTICS, icon: BarChart3 },
    ],
  },
  {
    labelKey: 'admin.nav.sectionCatalog',
    items: [
      { labelKey: 'admin.nav.products', path: PATHS.ADMIN_PRODUCTS, icon: ShoppingBag },
      { labelKey: 'admin.nav.orders', path: PATHS.ADMIN_ORDERS, icon: Package },
      { labelKey: 'admin.nav.customers', path: PATHS.ADMIN_CUSTOMERS, icon: Users },
      { labelKey: 'admin.nav.categories', path: PATHS.ADMIN_CATEGORIES, icon: FolderTree },
      { labelKey: 'admin.nav.inventory', path: PATHS.ADMIN_INVENTORY, icon: Warehouse },
    ],
  },
  {
    labelKey: 'admin.nav.sectionMarketing',
    items: [{ labelKey: 'admin.nav.coupons', path: PATHS.ADMIN_COUPONS, icon: Percent }],
  },
  {
    labelKey: 'admin.nav.sectionSystem',
    items: [{ labelKey: 'admin.nav.settings', path: PATHS.ADMIN_SETTINGS, icon: Settings }],
  },
] as const

export const ADMIN_QUICK_STATS = [
  { labelKey: 'admin.quickStats.pendingOrders', value: '12', tone: 'amber' as const },
  { labelKey: 'admin.quickStats.lowStock', value: '5', tone: 'rose' as const },
  { labelKey: 'admin.quickStats.todayRevenue', value: '48.2M', tone: 'emerald' as const },
] as const
