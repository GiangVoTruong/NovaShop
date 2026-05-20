import type { RouteObject } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import CollectionsPage from './components/CollectionsPage'
import ExplorePage from './components/ExplorePage'
import FlashSalePage from './components/FlashSalePage'
import ProductDetailPage from './components/ProductDetailPage'
import ProductListPage from './components/ProductListPage'

export const customerProductRoutes: RouteObject[] = [
  { path: PATHS.EXPLORE, Component: ExplorePage },
  { path: PATHS.COLLECTIONS, Component: CollectionsPage },
  { path: PATHS.FLASH_SALE, Component: FlashSalePage },
  { path: PATHS.PRODUCTS, Component: ProductListPage },
  { path: PATHS.PRODUCT_DETAIL, Component: ProductDetailPage },
]
