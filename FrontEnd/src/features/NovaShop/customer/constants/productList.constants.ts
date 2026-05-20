import type { CategorySlug } from '../../shared/types'

export type ListingMode = 'products' | 'explore' | 'collections' | 'flash-sale'

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Phổ biến' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: Thấp → Cao' },
  { value: 'price-desc', label: 'Giá: Cao → Thấp' },
  { value: 'rating', label: 'Đánh giá cao' },
]

export const LISTING_META: Record<
  ListingMode,
  { eyebrow: string; title: string; subtitle: string }
> = {
  products: {
    eyebrow: 'Tất cả sản phẩm',
    title: 'Khám phá bộ sưu tập',
    subtitle: 'Toàn bộ sản phẩm đang có trên NovaShop',
  },
  explore: {
    eyebrow: 'Khám phá',
    title: 'Sản phẩm nổi bật',
    subtitle: 'Những lựa chọn hot nhất theo xu hướng mua sắm',
  },
  collections: {
    eyebrow: 'Bộ sưu tập',
    title: 'Tuyển chọn theo phong cách',
    subtitle: 'Danh sách curated theo danh mục thời trang và lifestyle',
  },
  'flash-sale': {
    eyebrow: 'Flash Sale',
    title: 'Ưu đãi giới hạn thời gian',
    subtitle: 'Chỉ hiển thị sản phẩm có giảm giá',
  },
}

export const COLLECTION_DEFAULT_CATEGORIES: CategorySlug[] = [
  'fashion',
  'beauty',
  'home',
]
