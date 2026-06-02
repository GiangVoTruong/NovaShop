import { formatCurrency } from '@/features/NovaShop/shared/format'
import type { CategorySlug } from '@/features/NovaShop/shared/types'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { Pagination, Slider, Spin } from 'antd'
import { Filter, Grid2X2, List, Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCategories } from '../../catalog/hooks/useCategories'
import { useProducts } from '../../catalog/hooks/useProducts'
import { PATHS } from '@/router/paths'
import {
  LISTING_MODE_OPTIONS,
  SORT_OPTIONS,
  parseListingMode,
} from '../constants/product.constants'
import ProductCard from './ProductCard'

const PRICE_RANGE_DEFAULT: [number, number] = [0, 10_000_000]
const PAGE_SIZE = 12

function listingModeKey(mode: ReturnType<typeof parseListingMode>) {
  return mode === 'flash-sale' ? 'flashSale' : mode
}

export default function ProductListPage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = parseListingMode(searchParams.get('mode'))
  const categoryParam = searchParams.get('cat') as CategorySlug | null
  const keywordParam = searchParams.get('keyword')?.trim() ?? ''
  const modeKey = listingModeKey(mode)
  const listingKey = `${mode}:${categoryParam ?? ''}:${keywordParam}`
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [pagination, setPagination] = useState({ listingKey, page: 1 })
  const [localKeyword, setLocalKeyword] = useState(keywordParam)

  useEffect(() => {
    setLocalKeyword(keywordParam)
  }, [keywordParam])

  if (pagination.listingKey !== listingKey) {
    setPagination({ listingKey, page: 1 })
  }

  const page = pagination.page

  const productsQuery = useProducts({
    keyword: keywordParam || undefined,
    page: page - 1,
    size: PAGE_SIZE,
    category: categoryParam ?? undefined,
    mode: mode === 'flash-sale' ? 'flash-sale' : undefined,
    sortKey: 'popular',
  })

  const categoriesQuery = useCategories()
  const categories = categoriesQuery.data ?? []

  const pageItems = productsQuery.data?.data ?? []
  const totalCount = productsQuery.data?.total ?? 0
  const brands = Array.from(new Set(pageItems.map((product) => product.sellerName)))

  const handleProductSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams(searchParams)
    const nextKeyword = localKeyword.trim()

    if (nextKeyword) {
      params.set('keyword', nextKeyword)
    } else {
      params.delete('keyword')
    }

    const query = params.toString()
    navigate(query ? `${PATHS.PRODUCTS}?${query}` : PATHS.PRODUCTS)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {translate(`product.listing.${modeKey}.eyebrow`)}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {translate(`product.listing.${modeKey}.title`)}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {translate('product.listing.productCount', {
            count: totalCount,
            subtitle: translate(`product.listing.${modeKey}.subtitle`),
          })}
        </p>
      </header>

      <div className="flex gap-6">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="sticky top-24 customer-panel rounded-3xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-fuchsia-500 to-purple-500 text-white">
                  <SlidersHorizontal className="size-3.5" />
                </span>
                {translate('product.filters.title')}
              </h2>
              <button
                type="button"
                className="text-xs font-semibold text-fuchsia-600 hover:underline"
              >
                {translate('product.filters.reset')}
              </button>
            </div>

            <div className="space-y-2">
              {LISTING_MODE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-xl p-1 transition-colors hover:bg-fuchsia-50"
                >
                  <input
                    type="radio"
                    name="listingMode"
                    defaultChecked={option.value === mode}
                    readOnly
                    className="size-4 border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
                  />
                  <span className="text-sm text-slate-700">{translate(option.labelKey)}</span>
                </label>
              ))}

              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-xl p-1 transition-colors hover:bg-fuchsia-50"
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        readOnly
                        defaultChecked={categoryParam === category.slug}
                        className="size-4 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex cursor-pointer items-center gap-2 rounded-xl p-1 transition-colors hover:bg-fuchsia-50"
                  >
                    <input
                      type="checkbox"
                      readOnly
                      className="size-4 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
                    />
                    <span className="text-sm text-slate-700">{brand}</span>
                  </label>
                ))}
              </div>

              <Slider
                range
                disabled
                min={0}
                max={10_000_000}
                step={100_000}
                defaultValue={PRICE_RANGE_DEFAULT}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-700">
                  {formatCurrency(PRICE_RANGE_DEFAULT[0])}
                </span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-700">
                  {formatCurrency(PRICE_RANGE_DEFAULT[1])}
                </span>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 0].map((value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 rounded-xl p-1 transition-colors hover:bg-fuchsia-50"
                  >
                    <input
                      type="radio"
                      name="rating"
                      defaultChecked={value === 0}
                      readOnly
                      className="size-4 border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
                    />
                    <span className="text-sm text-slate-700">
                      {value === 0
                        ? translate('product.filters.ratingAll')
                        : translate('product.filters.ratingFrom', { value })}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl p-1 transition-colors hover:bg-fuchsia-50">
              <input
                type="checkbox"
                readOnly
                className="size-4 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500"
              />
              <span className="text-sm text-slate-700">
                {translate('product.filters.inStockOnly')}
              </span>
            </label>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <form
            onSubmit={handleProductSearch}
            className="customer-panel flex flex-col gap-3 rounded-3xl p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 sm:max-w-sm sm:flex-1">
              <Search className="size-4 text-slate-400" />
              <input
                value={localKeyword}
                onChange={(event) => setLocalKeyword(event.target.value)}
                placeholder={translate('product.filters.searchPlaceholder')}
                className="h-10 flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                defaultValue="popular"
                className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {translate(option.labelKey)}
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
                  aria-label={translate('product.filters.gridView')}
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
                  aria-label={translate('product.filters.listView')}
                >
                  <List className="size-4" />
                </button>
              </div>
              <button
                type="button"
                className="grid size-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 lg:hidden"
                aria-label={translate('product.filters.mobileFilters')}
              >
                <Filter className="size-4" />
              </button>
            </div>
          </form>

          {productsQuery.isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Spin size="large" />
            </div>
          ) : pageItems.length === 0 ? (
            <EmptyState
              title={translate('product.empty.title')}
              description={translate('product.empty.description')}
            />
          ) : (
            <div
              className={cx(
                view === 'grid'
                  ? 'grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4'
                  : 'flex flex-col gap-4',
              )}
            >
              {pageItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalCount > PAGE_SIZE && (
            <div className="customer-pagination flex justify-center pt-4">
              <Pagination
                current={page}
                total={totalCount}
                pageSize={PAGE_SIZE}
                onChange={(nextPage) => setPagination({ listingKey, page: nextPage })}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
