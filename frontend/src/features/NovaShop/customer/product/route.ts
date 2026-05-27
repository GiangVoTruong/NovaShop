import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import ProductDetailPage from './components/ProductDetailPage'
import ProductListPage from './components/ProductListPage'

export const customerProductRoutes: RouteObject[] = [
  {
    path: PATHS.EXPLORE,
    element: createElement(Navigate, { to: '/products?mode=explore', replace: true }),
  },
  {
    path: PATHS.COLLECTIONS,
    element: createElement(Navigate, { to: '/products?mode=collections', replace: true }),
  },
  {
    path: PATHS.FLASH_SALE,
    element: createElement(Navigate, { to: '/products?mode=flash-sale', replace: true }),
  },
  { path: PATHS.PRODUCTS, Component: ProductListPage },
  { path: PATHS.PRODUCT_DETAIL, Component: ProductDetailPage },
]
