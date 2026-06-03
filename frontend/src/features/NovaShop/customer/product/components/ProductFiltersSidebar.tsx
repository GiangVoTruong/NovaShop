import { formatCurrency, formatNumber } from '@/features/NovaShop/shared/format'
import StarRating from '@/features/NovaShop/shared/ui/StarRating'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { PATHS } from '@/router/paths'
import type { ApiCategoryResponse } from '@/types/product.types'
import { InputNumber, Slider, Switch } from 'antd'
import { Flame, Layers, LayoutGrid, RotateCcw, SlidersHorizontal, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getCategoryImage } from '../../catalog/lib/categoryApi'
import {
  LISTING_MODE_OPTIONS,
  parseListingMode,
  type ListingMode,
} from '../constants/product.constants'
import {
  normalizePriceRange,
  parseProductListFilters,
  PRODUCT_PRICE_MAX,
  PRODUCT_PRICE_MIN,
  type BrandOption,
} from '../lib/productListFilters'

const LISTING_MODE_ICONS = {
  products: LayoutGrid,
  explore: Sparkles,
  collections: Layers,
  'flash-sale': Flame,
} as const

const RATING_FILTER_VALUES = [5, 4, 3, 0] as const

type ProductFiltersSidebarProps = {
  categories: ApiCategoryResponse[]
  brandOptions: BrandOption[]
  className?: string
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{title}</h3>
      {children}
    </section>
  )
}

type PriceRangeFilterProps = {
  minPrice: number
  maxPrice: number
  onCommit: (minPrice: number, maxPrice: number) => void
}

function formatPriceInput(
  value: number | string | undefined,
  info?: { userTyping?: boolean },
): string {
  if (value === undefined || value === null || value === '') return ''
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return ''
  return info?.userTyping ? formatNumber(numeric) : formatCurrency(numeric)
}

function parsePriceInput(displayValue: string | undefined): number {
  const digits = displayValue?.replace(/\D/g, '') ?? ''
  return digits === '' ? 0 : Number(digits)
}

function PriceRangeFilter({ minPrice, maxPrice, onCommit }: PriceRangeFilterProps) {
  const { t: translate } = useTranslation()
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])

  const commitFromState = () => {
    const { minPrice: nextMin, maxPrice: nextMax } = normalizePriceRange(
      priceRange[0],
      priceRange[1],
    )
    setPriceRange([nextMin, nextMax])
    onCommit(nextMin, nextMax)
  }

  return (
    <FilterSection title={translate('product.filters.priceRange')}>
      <div className="rounded-2xl bg-slate-50/90 px-2 py-4">
        <Slider
          range
          min={PRODUCT_PRICE_MIN}
          max={PRODUCT_PRICE_MAX}
          step={100_000}
          value={priceRange}
          onChange={(values) => {
            const [nextMin, nextMax] = values as [number, number]
            setPriceRange([nextMin, nextMax])
          }}
          onChangeComplete={(values) => {
            const [nextMin, nextMax] = values as [number, number]
            setPriceRange([nextMin, nextMax])
            onCommit(nextMin, nextMax)
          }}
          className="product-filter-slider mb-4"
          tooltip={{ formatter: (value) => formatCurrency(Number(value ?? 0)) }}
        />
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
          <InputNumber
            min={PRODUCT_PRICE_MIN}
            max={priceRange[1]}
            step={100_000}
            value={priceRange[0]}
            formatter={formatPriceInput}
            parser={parsePriceInput}
            onChange={(value) => {
              const rawMin = value ?? PRODUCT_PRICE_MIN
              const nextMin = Math.max(PRODUCT_PRICE_MIN, Math.min(rawMin, priceRange[1]))
              setPriceRange([nextMin, priceRange[1]])
            }}
            onBlur={commitFromState}
            onPressEnter={commitFromState}
            className="w-full [&_.ant-input-number-input]:px-2 [&_.ant-input-number-input]:text-xs"
            controls={false}
          />
          <span className="shrink-0 text-slate-300">—</span>
          <InputNumber
            min={priceRange[0]}
            max={PRODUCT_PRICE_MAX}
            step={100_000}
            value={priceRange[1]}
            formatter={formatPriceInput}
            parser={parsePriceInput}
            onChange={(value) => {
              const rawMax = value ?? PRODUCT_PRICE_MAX
              const nextMax = Math.max(priceRange[0], Math.min(rawMax, PRODUCT_PRICE_MAX))
              setPriceRange([priceRange[0], nextMax])
            }}
            onBlur={commitFromState}
            onPressEnter={commitFromState}
            className="w-full [&_.ant-input-number-input]:px-2 [&_.ant-input-number-input]:text-xs"
            controls={false}
          />
        </div>
      </div>
    </FilterSection>
  )
}

export default function ProductFiltersSidebar({
  categories,
  brandOptions,
  className,
}: ProductFiltersSidebarProps) {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = parseListingMode(searchParams.get('mode'))
  const categoryParam = searchParams.get('cat')
  const filters = parseProductListFilters(searchParams)

  const navigateWithParams = (params: URLSearchParams) => {
    const query = params.toString()
    navigate(query ? `${PATHS.PRODUCTS}?${query}` : PATHS.PRODUCTS)
  }

  const patchParams = (patch: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams)
    patch(params)
    navigateWithParams(params)
  }

  const handleReset = () => {
    navigate(PATHS.PRODUCTS)
  }

  const handleModeChange = (nextMode: ListingMode) => {
    patchParams((params) => {
      if (nextMode === 'products') {
        params.delete('mode')
      } else {
        params.set('mode', nextMode)
      }
    })
  }

  const handleCategoryChange = (slug: string) => {
    patchParams((params) => {
      if (categoryParam === slug) {
        params.delete('cat')
      } else {
        params.set('cat', slug)
      }
    })
  }

  const handleSellerChange = (sellerId: string) => {
    patchParams((params) => {
      if (params.get('seller') === sellerId) {
        params.delete('seller')
      } else {
        params.set('seller', sellerId)
      }
    })
  }

  const commitPriceRange = (rawMinPrice: number, rawMaxPrice: number) => {
    const { minPrice, maxPrice } = normalizePriceRange(rawMinPrice, rawMaxPrice)

    patchParams((params) => {
      if (minPrice <= PRODUCT_PRICE_MIN) {
        params.delete('minPrice')
      } else {
        params.set('minPrice', String(minPrice))
      }
      if (maxPrice >= PRODUCT_PRICE_MAX) {
        params.delete('maxPrice')
      } else {
        params.set('maxPrice', String(maxPrice))
      }
    })
  }

  const handleRatingChange = (value: number) => {
    patchParams((params) => {
      if (value === 0) {
        params.delete('rating')
      } else {
        params.set('rating', String(value))
      }
    })
  }

  const handleStockChange = (checked: boolean) => {
    patchParams((params) => {
      if (checked) {
        params.set('stock', '1')
      } else {
        params.delete('stock')
      }
    })
  }

  return (
    <aside className={cx('hidden w-[304px] shrink-0 lg:block', className)}>
      <div className="sticky top-24 rounded-3xl border border-slate-200/90 bg-white shadow-[0_16px_48px_-20px_rgba(15,23,42,0.14)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-linear-to-br from-fuchsia-50/90 via-white to-violet-50/60 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-fuchsia-500 to-purple-600 text-white shadow-[0_8px_20px_-6px_rgba(217,70,239,0.55)]">
              <SlidersHorizontal className="size-4" />
            </span>
            <p className="text-sm font-extrabold tracking-tight text-slate-900">
              {translate('product.filters.title')}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-fuchsia-600 transition hover:bg-fuchsia-50"
          >
            <RotateCcw className="size-3.5" />
            {translate('product.filters.reset')}
          </button>
        </div>

        <div className="no-scrollbar max-h-[calc(100vh-10rem)] space-y-5 overflow-y-auto p-5">
          <FilterSection title={translate('product.filters.listingMode')}>
            <div className="flex flex-col gap-1.5">
              {LISTING_MODE_OPTIONS.map((option) => {
                const ModeIcon = LISTING_MODE_ICONS[option.value]
                const isActive = mode === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleModeChange(option.value)}
                    className={cx(
                      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-linear-to-r from-fuchsia-500 to-purple-600 text-white shadow-[0_10px_24px_-10px_rgba(168,85,247,0.65)]'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )}
                  >
                    <ModeIcon className="size-4 shrink-0 opacity-90" />
                    {translate(option.labelKey)}
                  </button>
                )
              })}
            </div>
          </FilterSection>

          <div className="border-t border-slate-100" />

          <FilterSection title={translate('product.filters.category')}>
            <div className="no-scrollbar flex max-h-52 flex-col gap-1.5 overflow-y-auto pr-0.5">
              {categories.map((category) => {
                const isActive = categoryParam === category.slug

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryChange(category.slug)}
                    className={cx(
                      'flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all duration-200',
                      isActive
                        ? 'border-fuchsia-200 bg-fuchsia-50/90 ring-1 ring-fuchsia-200/80'
                        : 'border-transparent bg-slate-50/80 hover:border-slate-200 hover:bg-white',
                    )}
                  >
                    <img
                      src={getCategoryImage(category.slug)}
                      alt=""
                      className="size-9 shrink-0 rounded-lg object-cover ring-1 ring-white"
                    />
                    <span
                      className={cx(
                        'min-w-0 flex-1 truncate text-sm font-semibold',
                        isActive ? 'text-fuchsia-700' : 'text-slate-700',
                      )}
                    >
                      {category.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </FilterSection>

          {brandOptions.length > 0 ? (
            <>
              <div className="border-t border-slate-100" />
              <FilterSection title={translate('product.filters.brand')}>
                <div className="flex flex-wrap gap-2">
                  {brandOptions.map((brand) => {
                    const isActive = filters.sellerId === brand.sellerId

                    return (
                      <button
                        key={brand.sellerId}
                        type="button"
                        onClick={() => handleSellerChange(brand.sellerId)}
                        className={cx(
                          'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                          isActive
                            ? 'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-fuchsia-200 hover:text-fuchsia-600',
                        )}
                      >
                        {brand.sellerName}
                      </button>
                    )
                  })}
                </div>
              </FilterSection>
            </>
          ) : null}

          <div className="border-t border-slate-100" />

          <PriceRangeFilter
            key={`${filters.minPrice}-${filters.maxPrice}`}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onCommit={commitPriceRange}
          />

          <div className="border-t border-slate-100" />

          <FilterSection title={translate('product.filters.rating')}>
            <div className="flex flex-col gap-1.5">
              {RATING_FILTER_VALUES.map((value) => {
                const isActive =
                  value === 0 ? filters.minRating == null : filters.minRating === value

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingChange(value)}
                    className={cx(
                      'flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all duration-200',
                      isActive
                        ? 'border-fuchsia-200 bg-fuchsia-50/90 text-fuchsia-700 ring-1 ring-fuchsia-200/80'
                        : 'border-transparent bg-slate-50/80 text-slate-600 hover:border-slate-200 hover:bg-white',
                    )}
                  >
                    {value === 0 ? (
                      <span className="text-sm font-semibold">
                        {translate('product.filters.ratingAll')}
                      </span>
                    ) : (
                      <>
                        <StarRating value={value} size={14} />
                        <span className="text-sm font-medium">
                          {translate('product.filters.ratingFrom', { value })}
                        </span>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </FilterSection>

          <div className="border-t border-slate-100" />

          <FilterSection title={translate('product.filters.stock')}>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-slate-50/90 px-3 py-3">
              <span className="text-sm font-semibold text-slate-700">
                {translate('product.filters.inStockOnly')}
              </span>
              <Switch checked={filters.inStockOnly} onChange={handleStockChange} size="small" />
            </label>
          </FilterSection>
        </div>
      </div>
    </aside>
  )
}
