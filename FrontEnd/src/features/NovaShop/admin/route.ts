import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import AdminLayout from './layout/components/AdminLayout'
import { adminAnalyticsRoutes } from './analytics/route'
import { adminCategoryRoutes } from './categories/route'
import { adminCouponRoutes } from './coupons/route'
import { adminCustomerRoutes } from './customers/route'
import { adminDashboardRoutes } from './dashboard/route'
import { adminInventoryRoutes } from './inventory/route'
import { adminOrderRoutes } from './orders/route'
import { adminProductRoutes } from './products/route'
import { adminSettingsRoutes } from './settings/route'

export const adminRoutes: RouteObject[] = [
  {
    element: createElement(AdminLayout),
    children: [
      ...adminDashboardRoutes,
      ...adminProductRoutes,
      ...adminOrderRoutes,
      ...adminCustomerRoutes,
      ...adminCategoryRoutes,
      ...adminInventoryRoutes,
      ...adminCouponRoutes,
      ...adminAnalyticsRoutes,
      ...adminSettingsRoutes,
    ],
  },
]
