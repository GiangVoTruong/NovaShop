import type { CategorySlug } from '@/features/NovaShop/shared/types'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import { PATHS } from '@/router/paths'
import { Pagination, Spin } from 'antd'
import { Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCategories } from '../../catalog/hooks/useCategories'
import { useProducts } from '../../catalog/hooks/useProducts'
import { parseListingMode, SORT_OPTIONS } from '../constants/product.constants'
import { useProductBrandOptions } from '../hooks/useProductBrandOptions'
import {
  buildProductListingKey,
  filterProductsByClientCriteria,
  hasClientOnlyFilters,
  parseProductListFilters,
  PRODUCT_CLIENT_FILTER_FETCH_SIZE,
} from '../lib/productListFilters'
import ProductCard from './ProductCard'
import ProductFiltersSidebar from './ProductFiltersSidebar'

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
  const filters = parseProductListFilters(searchParams)
  const modeKey = listingModeKey(mode)
  const listingKey = buildProductListingKey(mode, categoryParam, keywordParam, filters)
  const usesClientFilter = hasClientOnlyFilters(filters)
  const [pagination, setPagination] = useState({ listingKey, page: 1 })

  if (pagination.listingKey !== listingKey) {
    setPagination({ listingKey, page: 1 })
  }

  const page = pagination.page
  const brandOptions = useProductBrandOptions()

  const productsQuery = useProducts({
    keyword: keywordParam || undefined,
    page: usesClientFilter ? 0 : page - 1,
    size: usesClientFilter ? PRODUCT_CLIENT_FILTER_FETCH_SIZE : PAGE_SIZE,
    category: categoryParam ?? undefined,
    mode: mode === 'flash-sale' ? 'flash-sale' : undefined,
    sellerId: filters.sellerId ?? undefined,
    sortKey: 'popular',
  })

  const categoriesQuery = useCategories()
  const categories = categoriesQuery.data ?? []

  const fetchedItems = productsQuery.data?.data ?? []
  const filteredItems = usesClientFilter
    ? filterProductsByClientCriteria(fetchedItems, filters)
    : fetchedItems
  const startIndex = (page - 1) * PAGE_SIZE
  const displayItems = usesClientFilter
    ? filteredItems.slice(startIndex, startIndex + PAGE_SIZE)
    : fetchedItems
  const displayTotal = usesClientFilter
    ? filteredItems.length
    : (productsQuery.data?.total ?? 0)

  const handleProductSearch = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams(searchParams)
    const nextKeyword = String(new FormData(event.currentTarget).get('keyword') ?? '').trim()

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
            count: displayTotal,
            subtitle: translate(`product.listing.${modeKey}.subtitle`),
          })}
        </p>
      </header>

      <div className="flex gap-6">
        <ProductFiltersSidebar categories={categories} brandOptions={brandOptions} />

        <div className="min-w-0 flex-1 space-y-6">
          <form
            onSubmit={handleProductSearch}
            className="customer-panel flex flex-col gap-3 rounded-3xl p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 sm:max-w-sm sm:flex-1">
              <Search className="size-4 text-slate-400" />
              <input
                key={keywordParam}
                name="keyword"
                defaultValue={keywordParam}
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
          ) : displayItems.length === 0 ? (
            <EmptyState
              title={translate('product.empty.title')}
              description={translate('product.empty.description')}
            />
          ) : (
            <div className="customer-scroll-section grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {displayItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {displayTotal > PAGE_SIZE && (
            <div className="customer-pagination flex justify-center pt-4">
              <Pagination
                current={page}
                total={displayTotal}
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
