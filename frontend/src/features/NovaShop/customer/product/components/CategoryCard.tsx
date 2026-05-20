import { PATHS } from '@/router/paths'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Category } from '../../../shared/types'
import { CATEGORY_GLOW } from '../../../shared/ui/categoryTokens'
import { cx } from '../../../shared/ui/cx'
import { CATEGORY_CARD_VARIANT_RATIO } from '../constants/product.constants'

interface CategoryCardProps {
  category: Category
  variant?: 'tall' | 'wide' | 'square'
  /** Lấp đầy ô grid (bento) — không ép aspect-square */
  fill?: boolean
}

export default function CategoryCard({
  category,
  variant = 'square',
  fill = false,
}: CategoryCardProps) {
  return (
    <Link
      to={`${PATHS.PRODUCTS}?cat=${category.slug}`}
      className={cx(
        'group/cat relative isolate block min-h-0 overflow-hidden rounded-3xl bg-slate-900 transition-all duration-500 hover:-translate-y-1.5',
        fill ? 'h-full w-full' : CATEGORY_CARD_VARIANT_RATIO[variant],
        CATEGORY_GLOW[category.slug],
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover/cat:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-900/40 to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-5 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          {category.productCount} sản phẩm
        </p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-xl font-extrabold tracking-tight">{category.name}</p>
          <span className="grid size-10 place-items-center rounded-2xl bg-white/15 backdrop-blur-md transition-all group-hover/cat:bg-white group-hover/cat:text-slate-900">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
