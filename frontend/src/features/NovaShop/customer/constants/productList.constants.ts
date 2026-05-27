import { PATHS } from '@/router/paths'
import type { CategorySlug } from '../../shared/types'

export type ListingMode = 'products' | 'explore' | 'collections' | 'flash-sale'

export const SORT_OPTIONS = [
  { value: 'popular', labelKey: 'product.sort.popular' },
  { value: 'newest', labelKey: 'product.sort.newest' },
  { value: 'price-asc', labelKey: 'product.sort.priceAsc' },
  { value: 'price-desc', labelKey: 'product.sort.priceDesc' },
  { value: 'rating', labelKey: 'product.sort.rating' },
] as const

export const LISTING_MODES = ['products', 'explore', 'collections', 'flash-sale'] as const satisfies ListingMode[]

export const LISTING_MODE_OPTIONS = [
  { value: 'products' as const, labelKey: 'product.filters.listingModeOptions.all' },
  { value: 'explore' as const, labelKey: 'product.filters.listingModeOptions.explore' },
  { value: 'collections' as const, labelKey: 'product.filters.listingModeOptions.collections' },
  { value: 'flash-sale' as const, labelKey: 'product.filters.listingModeOptions.flashSale' },
] as const

export const COLLECTION_DEFAULT_CATEGORIES: CategorySlug[] = [
  'fashion',
  'beauty',
  'home',
]

export function parseListingMode(value: string | null): ListingMode {
  if (value && LISTING_MODES.includes(value as ListingMode)) {
    return value as ListingMode
  }
  return 'products'
}

export function productsPath(options?: { mode?: ListingMode; cat?: CategorySlug }) {
  const params = new URLSearchParams()
  if (options?.mode && options.mode !== 'products') {
    params.set('mode', options.mode)
  }
  if (options?.cat) {
    params.set('cat', options.cat)
  }
  const query = params.toString()
  return query ? `${PATHS.PRODUCTS}?${query}` : PATHS.PRODUCTS
}
