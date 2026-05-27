import { PATHS } from '@/router/paths'

export const CUSTOMER_NAV_LINKS = [
  { labelKey: 'nav.home', to: PATHS.HOME },
  { labelKey: 'nav.products', to: PATHS.PRODUCTS },
  { labelKey: 'nav.orders', to: PATHS.ORDERS },
] as const
