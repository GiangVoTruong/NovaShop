import type { ApiCategoryResponse } from '@/types/product.types'
import type { CategorySlug } from '@/features/NovaShop/shared/types'

const CATEGORY_SLUGS: CategorySlug[] = [
  'electronics',
  'fashion',
  'gaming',
  'office',
  'home',
  'beauty',
]

const CATEGORY_IMAGES: Record<CategorySlug, string> = {
  electronics:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop',
  fashion:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop',
  office:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop',
  home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop',
  beauty:
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop',
}

export function normalizeCategorySlug(slug: string): CategorySlug {
  if (CATEGORY_SLUGS.includes(slug as CategorySlug)) {
    return slug as CategorySlug
  }
  return 'electronics'
}

export function buildCategorySlugMap(
  categories: ApiCategoryResponse[],
): Map<string, string> {
  return new Map(categories.map((category) => [category.id, category.slug]))
}

export function getCategoryImage(slug: string): string {
  return CATEGORY_IMAGES[normalizeCategorySlug(slug)]
}
