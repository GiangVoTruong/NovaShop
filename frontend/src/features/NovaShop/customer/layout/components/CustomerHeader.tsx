import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import NotificationBell from '@/features/NovaShop/shared/notifications/components/NotificationBell'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import LanguageSwitcher from '@/lib/i18n/LanguageSwitcher'
import { PATHS } from '@/router/paths'
import { Heart, Search, ShoppingCart, Sparkles, User } from 'lucide-react'
import { useState, type SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCartItemCount } from '@/features/NovaShop/customer/cart/hooks/useCart'
import { CUSTOMER_NAV_LINKS } from '../constants/layout.constants'

function CartBadge({ count }: { count: number }) {
  if (count <= 0) {
    return null
  }

  return (
    <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-linear-to-r from-fuchsia-500 to-purple-500 px-1 text-[10px] font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}

function HeaderCartLink() {
  const { t: translate } = useTranslation()
  const cartItemCount = useCartItemCount()

  return (
    <Link
      to={PATHS.CART}
      className="relative hidden size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-purple-50 hover:text-purple-600 lg:grid"
      aria-label={translate('nav.cart')}
    >
      <ShoppingCart className="size-5" />
      <CartBadge count={cartItemCount} />
    </Link>
  )
}

export default function CustomerHeader() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleSearchSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keyword = searchKeyword.trim()
    if (!keyword) {
      navigate(PATHS.PRODUCTS)
      return
    }

    const params = new URLSearchParams({ keyword })
    navigate(`${PATHS.PRODUCTS}?${params.toString()}`)
  }

  return (
    <header className="customer-header sticky top-0 z-50 w-full">
      <div className="customer-header-bar customer-surface w-full">
        <div className="mx-auto flex h-[72px] max-w-[1440px] flex-nowrap items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-10 xl:px-14">
          <Link to={PATHS.HOME} className="flex shrink-0 items-center gap-2.5">
            <span className="relative grid size-10 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-[0_8px_24px_-8px_rgba(217,70,239,0.55)]">
              <Sparkles className="size-5" strokeWidth={2.5} />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Nova<span className="text-gradient">Shop</span>
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
                {translate('brand.tagline')}
              </span>
            </div>
          </Link>

          <nav className="hidden shrink-0 items-center gap-0.5 rounded-2xl bg-slate-100/70 p-1 lg:flex">
            {CUSTOMER_NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === PATHS.HOME}
                className={({ isActive }) =>
                  cx(
                    'whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'customer-nav-pill text-white'
                      : 'text-slate-500 hover:bg-white/80 hover:text-slate-900',
                  )
                }
              >
                {translate(link.labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden min-w-0 max-w-sm flex-1 items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/90 px-3 shadow-sm transition focus-within:border-fuchsia-300/80 focus-within:ring-2 focus-within:ring-fuchsia-100/80 md:flex lg:max-w-md"
            >
              <Search className="size-4 shrink-0 text-fuchsia-400" />
              <label htmlFor="customer-search" className="sr-only">
                {translate('nav.searchPlaceholder')}
              </label>
              <input
                id="customer-search"
                name="customerSearch"
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder={translate('nav.searchPlaceholder')}
                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400 lg:inline">
                Enter
              </kbd>
            </form>

            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
              <LanguageSwitcher />
              <Link
                to={PATHS.WISHLIST}
                className="relative hidden size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-fuchsia-50 hover:text-fuchsia-600 lg:grid"
                aria-label={translate('nav.wishlist')}
              >
                <Heart className="size-5" />
              </Link>
              <HeaderCartLink />
              {isAuthenticated ? (
                <NotificationBell
                  className="relative grid size-10 shrink-0 place-items-center rounded-xl text-slate-600 transition hover:bg-fuchsia-50 hover:text-fuchsia-600"
                  badgeClassName="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-linear-to-r from-fuchsia-500 to-purple-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
                />
              ) : null}
              {!isAuthenticated ? (
                <>
                  <Link
                    to={PATHS.LOGIN}
                    className="hidden h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200/80 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-fuchsia-300 hover:text-fuchsia-600 lg:inline-flex"
                  >
                    <User className="size-4 shrink-0" />
                    {translate('auth.login')}
                  </Link>
                  <Link
                    to={PATHS.REGISTER}
                    className="hidden h-10 shrink-0 items-center whitespace-nowrap rounded-xl bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(217,70,239,0.55)] transition hover:brightness-105 active:scale-[0.98] lg:inline-flex"
                  >
                    {translate('auth.register')}
                  </Link>
                </>
              ) : (
                <Link
                  to={PATHS.PROFILE}
                  className="hidden h-10 max-w-[180px] shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-fuchsia-300 hover:text-fuchsia-600 lg:inline-flex"
                  aria-label={translate('nav.profile')}
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="size-7 shrink-0 rounded-full object-cover ring-2 ring-fuchsia-100"
                    />
                  ) : (
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-linear-to-br from-fuchsia-500 to-purple-500 text-white">
                      <User className="size-3.5" />
                    </span>
                  )}
                  <span className="truncate">{user?.fullName ?? translate('nav.profile')}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
