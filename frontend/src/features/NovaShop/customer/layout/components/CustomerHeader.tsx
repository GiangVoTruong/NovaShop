import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { useShop } from '@/features/NovaShop/shared/store/useShop'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import LanguageSwitcher from '@/lib/i18n/LanguageSwitcher'
import { PATHS } from '@/router/paths'
import { Drawer } from 'antd'
import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CUSTOMER_NAV_LINKS } from '../constants/layout.constants'

export default function CustomerHeader() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const { cartCount, wishlistCount } = useShop()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cx(
        'customer-header sticky top-0 z-50 w-full transition-all duration-300',
        scrolled && 'customer-header-scrolled',
      )}
    >
      <div className="customer-header-bar customer-surface w-full">
        <div className="mx-auto flex h-[72px] max-w-[1440px] flex-nowrap items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-10 xl:px-14">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid size-10 place-items-center rounded-xl border border-slate-200/80 bg-white text-slate-700 transition hover:border-fuchsia-300 hover:text-fuchsia-600 lg:hidden"
            aria-label={translate('nav.openMenu')}
          >
            <Menu className="size-5" />
          </button>

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
            <label htmlFor="customer-search" className="sr-only">
              {translate('nav.searchPlaceholder')}
            </label>
            <div className="hidden min-w-0 max-w-sm flex-1 items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/90 px-3 shadow-sm transition focus-within:border-fuchsia-300/80 focus-within:ring-2 focus-within:ring-fuchsia-100/80 md:flex lg:max-w-md">
              <Search className="size-4 shrink-0 text-fuchsia-400" />
              <input
                id="customer-search"
                name="customerSearch"
                type="search"
                placeholder={translate('nav.searchPlaceholder')}
                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400 lg:inline">
                ⌘K
              </kbd>
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
              <LanguageSwitcher />
              <Link
                to={PATHS.WISHLIST}
                className="relative grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-fuchsia-50 hover:text-fuchsia-600"
                aria-label={translate('nav.wishlist')}
              >
                <Heart className="size-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to={PATHS.CART}
                className="relative grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-purple-50 hover:text-purple-600"
                aria-label={translate('nav.cart')}
              >
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-linear-to-r from-fuchsia-500 to-purple-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                to={isAuthenticated ? PATHS.PROFILE : PATHS.LOGIN}
                className="hidden h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200/80 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-fuchsia-300 hover:text-fuchsia-600 lg:inline-flex"
              >
                <User className="size-4 shrink-0" />
                {isAuthenticated
                  ? user?.fullName?.split(' ')[0] ?? translate('nav.profile')
                  : translate('auth.login')}
              </Link>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    navigate(PATHS.HOME)
                  }}
                  className="hidden h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200/80 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600 lg:inline-flex"
                >
                  <LogOut className="size-4 shrink-0" />
                  {translate('auth.logout')}
                </button>
              ) : (
                <Link
                  to={PATHS.REGISTER}
                  className="hidden h-10 shrink-0 items-center whitespace-nowrap rounded-xl bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(217,70,239,0.55)] transition hover:brightness-105 active:scale-[0.98] lg:inline-flex"
                >
                  {translate('auth.register')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="left"
        size={300}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <div className="mesh-bg flex h-full flex-col p-6">
          <div className="mb-8 flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white">
              <ShoppingBag className="size-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Nova<span className="text-gradient">Shop</span>
            </span>
          </div>
          <nav className="flex flex-col gap-1.5">
            {CUSTOMER_NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === PATHS.HOME}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'rounded-2xl px-4 py-3 text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-md'
                      : 'text-slate-700 hover:bg-white/70',
                  )
                }
              >
                {translate(link.labelKey)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t border-white/40 pt-6">
            <div className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-700">
              <LanguageSwitcher className="bg-white/80" />
              <span>{translate('common.language')}</span>
            </div>
            {isAuthenticated ? (
              <>
                <Link
                  to={PATHS.PROFILE}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  {user?.fullName ?? translate('nav.profile')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                    navigate(PATHS.HOME)
                  }}
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-600"
                >
                  {translate('auth.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to={PATHS.LOGIN}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  {translate('auth.login')}
                </Link>
                <Link
                  to={PATHS.REGISTER}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-md"
                >
                  {translate('auth.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  )
}
