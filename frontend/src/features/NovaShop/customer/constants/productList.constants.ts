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

export const COLLECTION_DEFAULT_CATEGORIES: CategorySlug[] = [
  'fashion',
  'beauty',
  'home',
]
