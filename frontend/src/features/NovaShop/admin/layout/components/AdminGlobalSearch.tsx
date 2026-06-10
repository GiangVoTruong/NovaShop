import { useQuery } from '@tanstack/react-query'
import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { adminOrderDetailPath, PATHS, productDetailPath } from '@/router/paths'
import adminSearchService from '../../services/adminSearchService'

export default function AdminGlobalSearch() {
  const { t: translate } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedKeyword(keyword.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [keyword])

  const searchQuery = useQuery({
    queryKey: ['admin', 'search', debouncedKeyword],
    queryFn: () => adminSearchService.search(debouncedKeyword),
    enabled: debouncedKeyword.length >= 2,
  })

  const results = searchQuery.data
  const hasResults =
    Boolean(results) &&
    (results.orders.length > 0 || results.products.length > 0 || results.customers.length > 0)

  return (
    <div className="relative hidden min-w-0 flex-1 sm:block">
      <label htmlFor="admin-global-search" className="sr-only">
        {translate('admin.header.searchPlaceholder')}
      </label>
      <input
        id="admin-global-search"
        name="adminSearch"
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder={translate('admin.header.searchPlaceholder')}
        className="h-10 w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
      />

      {debouncedKeyword.length >= 2 ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          {searchQuery.isLoading ? (
            <div className="grid place-items-center py-6">
              <Spin size="small" />
            </div>
          ) : hasResults ? (
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {results.orders.length > 0 ? (
                <section>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {translate('admin.nav.orders')}
                  </p>
                  <ul className="space-y-1">
                    {results.orders.map((order) => (
                      <li key={order.id}>
                        <Link
                          to={adminOrderDetailPath(order.id)}
                          className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span className="font-semibold">{order.orderCode}</span>
                          <span className="text-slate-400"> · {order.customerName}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {results.products.length > 0 ? (
                <section>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {translate('admin.nav.products')}
                  </p>
                  <ul className="space-y-1">
                    {results.products.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={productDetailPath(product.id)}
                          className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {results.customers.length > 0 ? (
                <section>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {translate('admin.nav.customers')}
                  </p>
                  <ul className="space-y-1">
                    {results.customers.map((customer) => (
                      <li key={customer.id}>
                        <Link
                          to={PATHS.ADMIN_CUSTOMERS}
                          className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span className="font-semibold">{customer.fullName}</span>
                          <span className="text-slate-400"> · {customer.email}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-slate-500">
              {translate('admin.header.searchEmpty')}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
