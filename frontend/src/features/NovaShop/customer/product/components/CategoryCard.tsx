import { CATEGORY_GLOW } from '@/features/NovaShop/shared/ui/categoryTokens'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { PATHS } from '@/router/paths'
import type { ApiCategoryResponse } from '@/types/product.types'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { normalizeCategorySlug } from '../../catalog/lib/categoryApi'
import { CATEGORY_CARD_VARIANT_RATIO } from '../constants/product.constants'

interface CategoryCardProps {
  category: ApiCategoryResponse
  variant?: 'tall' | 'wide' | 'square'
  /** Lấp đầy ô grid (bento) — không ép aspect-square */
  fill?: boolean
}

export default function CategoryCard({
  category,
  variant = 'square',
  fill = false,
}: CategoryCardProps) {
  const categorySlug = normalizeCategorySlug(category.slug)

  return (
    <Link
      to={`${PATHS.PRODUCTS}?cat=${category.slug}`}
      className={cx(
        'group/cat relative isolate block min-h-0 overflow-hidden rounded-3xl bg-slate-900 transition-all duration-500 hover:-translate-y-1.5',
        fill ? 'h-full w-full' : CATEGORY_CARD_VARIANT_RATIO[variant],
        CATEGORY_GLOW[categorySlug],
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={category.imageUrl ?? ''}
          alt={category.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover/cat:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-900/40 to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-extrabold tracking-tight">{category.name}</p>
          <span className="grid size-10 place-items-center rounded-2xl bg-white/15 backdrop-blur-md transition-all group-hover/cat:bg-white group-hover/cat:text-slate-900">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
