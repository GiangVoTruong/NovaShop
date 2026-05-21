import { useMemo, useState } from 'react'
import { Pagination, Slider } from 'antd'
import { Filter, Grid2X2, List, Search, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import {
  COLLECTION_DEFAULT_CATEGORIES,
  SORT_OPTIONS,
  type ListingMode,
} from '../constants/product.constants'
import { CATEGORIES } from '../../../shared/data/categories'
import { PRODUCTS } from '../../../shared/data/products'
import type { CategorySlug } from '../../../shared/types'
import { formatCurrency } from '../../../shared/format'
import EmptyState from '../../../shared/ui/EmptyState'
import { cx } from '../../../shared/ui/cx'
import ProductCard from './ProductCard'

const BRANDS = Array.from(new Set(PRODUCTS.map((entry) => entry.brand)))

const PAGE_SIZE = 8

function listingModeKey(mode: ListingMode) {
  return mode === 'flash-sale' ? 'flashSale' : mode
}

interface ProductListPageProps {
  mode?: ListingMode
}

export default function ProductListPage({ mode = 'products' }: ProductListPageProps) {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const modeKey = listingModeKey(mode)
  const initialCategory = params.get('cat') as CategorySlug | null
  const presetCategories =
    mode === 'collections' ? COLLECTION_DEFAULT_CATEGORIES : []
  const initialCategories = initialCategory ? [initialCategory] : presetCategories

  const [selectedCategories, setSelectedCategories] = useState<CategorySlug[]>(
    initialCategories,
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [minRating, setMinRating] = useState<number>(0)
  const [inStock, setInStock] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('popular')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState<number>(1)

  const filtered = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (mode === 'flash-sale' && !product.originalPrice) return false
      if (
        selectedCategories.length &&
        !selectedCategories.includes(product.category)
      )
        return false
      if (selectedBrands.length && !selectedBrands.includes(product.brand))
        return false
      if (product.price < priceRange[0] || product.price > priceRange[1])
        return false
      if (product.rating < minRating) return false
      if (inStock && product.stock === 0) return false
      if (
        search &&
        !product.name.toLowerCase().includes(search.toLowerCase()) &&
        !product.brand.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    }).sort((left, right) => {
      switch (sort) {
        case 'price-asc':
          return left.price - right.price
        case 'price-desc':
          return right.price - left.price
        case 'rating':
          return right.rating - left.rating
        case 'newest':
          return right.createdAt.localeCompare(left.createdAt)
        default:
          return right.reviewCount - left.reviewCount
      }
    })
  }, [
    mode,
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    inStock,
    search,
    sort,
  ])

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleCategory = (slug: CategorySlug) => {
    setSelectedCategories((current) =>
      current.includes(slug)
        ? current.filter((entry) => entry !== slug)
        : [...current, slug],
    )
    setPage(1)
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((entry) => entry !== brand)
        : [...current, brand],
    )
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {t(`product.listing.${modeKey}.eyebrow`)}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t(`product.listing.${modeKey}.title`)}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {t('product.listing.productCount', {
            count: filtered.length,
            subtitle: t(`product.listing.${modeKey}.subtitle`),
          })}
        </p>
      </header>

      <div className="flex gap-6">
        {/* SIDEBAR */}
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="sticky top-24 rounded-3xl border border-slate-200/60 bg-white/85 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-fuchsia-500 to-purple-500 text-white">
                  <SlidersHorizontal className="size-3.5" />
                </span>
                {t('product.filters.title')}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories(initialCategories)
                  setSelectedBrands([])
                  setPriceRange([0, 10000000])
                  setMinRating(0)
                  setInStock(false)
                  setSearch('')
                }}
                className="text-xs font-semibold text-fuchsia-600 hover:underline"
              >
                {t('product.filters.reset')}
              </button>
            </div>

            <FilterSection title={t('product.filters.category')}>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-xl p-1 transition-colors hover:bg-fuchsia-50"
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.slug)}
                        onChange={() => toggleCategory(category.slug)}
                        className="size-4 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      {category.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {category.productCount}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={t('product.filters.brand')}>
              <div className="space-y-2">
                {BRANDS.map((brand) => (
                  <label
                    key={brand}
                    className="flex cursor-pointer items-center gap-2 rounded-xl p-1 transition-colors hover:bg-fuchsia-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="size-4 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
                    />
                    <span className="text-sm text-slate-700">{brand}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={t('product.filters.priceRange')}>
              <Slider
                range
                min={0}
                max={10000000}
                step={100000}
                value={priceRange}
                onChange={(value) => {
                  setPriceRange(value as [number, number])
                  setPage(1)
                }}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-700">
                  {formatCurrency(priceRange[0])}
                </span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-700">
                  {formatCurrency(priceRange[1])}
                </span>
              </div>
            </FilterSection>

            <FilterSection title={t('product.filters.rating')}>
              <div className="space-y-2">
                {[5, 4, 3, 0].map((value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 rounded-xl p-1 transition-colors hover:bg-fuchsia-50"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === value}
                      onChange={() => setMinRating(value)}
                      className="size-4 border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
                    />
                    <span className="text-sm text-slate-700">
                      {value === 0
                        ? t('product.filters.ratingAll')
                        : t('product.filters.ratingFrom', { value })}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={t('product.filters.stock')} last>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl p-1 transition-colors hover:bg-fuchsia-50">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(event) => setInStock(event.target.checked)}
                  className="size-4 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span className="text-sm text-slate-700">{t('product.filters.inStockOnly')}</span>
              </label>
            </FilterSection>
          </div>
        </aside>

        {/* MAIN */}
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/60 bg-white/85 p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 sm:max-w-sm sm:flex-1">
              <Search className="size-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder={t('product.filters.searchPlaceholder')}
                className="h-10 flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
              <div className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 sm:flex">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={cx(
                    'grid size-8 place-items-center rounded-xl transition-all',
                    view === 'grid'
                      ? 'bg-linear-to-br from-fuchsia-500 to-purple-500 text-white shadow'
                      : 'text-slate-500',
                  )}
                  aria-label={t('product.filters.gridView')}
                >
                  <Grid2X2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={cx(
                    'grid size-8 place-items-center rounded-xl transition-all',
                    view === 'list'
                      ? 'bg-linear-to-br from-fuchsia-500 to-purple-500 text-white shadow'
                      : 'text-slate-500',
                  )}
                  aria-label={t('product.filters.listView')}
                >
                  <List className="size-4" />
                </button>
              </div>
              <button
                type="button"
                className="grid size-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 lg:hidden"
                aria-label={t('product.filters.mobileFilters')}
              >
                <Filter className="size-4" />
              </button>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <EmptyState
              title={t('product.empty.title')}
              description={t('product.empty.description')}
            />
          ) : (
            <div
              className={cx(
                view === 'grid'
                  ? 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                  : 'flex flex-col gap-4',
              )}
            >
              {pageItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="flex justify-center pt-2">
              <Pagination
                current={page}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterSection({
  title,
  children,
  last,
}: {
  title: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={cx('py-4', !last && 'border-b border-slate-100')}>
      <p className="mb-3 text-sm font-bold text-slate-900">{title}</p>
      {children}
    </div>
  )
}
