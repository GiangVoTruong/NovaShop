import type { CategorySlug } from '@/features/NovaShop/shared/types'
import type { ApiCategoryResponse } from '@/types/product.types'

const CATEGORY_SLUGS: CategorySlug[] = [
  'electronics',
  'fashion',
  'gaming',
  'office',
  'home',
  'beauty',
]

export function normalizeCategorySlug(slug: string): CategorySlug {
  if (CATEGORY_SLUGS.includes(slug as CategorySlug)) {
    return slug as CategorySlug
  }
  return 'electronics'
}

export function buildCategorySlugMap(categories: ApiCategoryResponse[]): Map<string, string> {
  return new Map(categories.map((category) => [category.id, category.slug]))
}
