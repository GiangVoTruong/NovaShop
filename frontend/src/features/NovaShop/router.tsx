import type { RouteObject } from 'react-router-dom'
import { adminRoutes } from './admin/route'
import { customerRoutes } from './customer/route'

export const novaShopRoutes: RouteObject[] = [...customerRoutes, ...adminRoutes]
