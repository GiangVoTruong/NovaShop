import LanguageSwitcher from '@/lib/i18n/LanguageSwitcher'
import { PATHS } from '@/router/paths'
import { Drawer } from 'antd'
import { Heart, Menu, Search, ShoppingBag, ShoppingCart, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { useShop } from '../../../shared/store/useShop'
import { cx } from '../../../shared/ui/cx'
import { CUSTOMER_NAV_LINKS } from '../constants/layout.constants'

export default function CustomerHeader() {
  const { t } = useTranslation()
  const { cartCount, wishlistCount } = useShop()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto flex h-[68px] max-w-[1440px] flex-nowrap items-center gap-2 overflow-hidden rounded-2xl border border-white/60 bg-white/75 px-3 shadow-[0_10px_40px_-15px_rgba(168,85,247,0.25)] backdrop-blur-xl sm:gap-3 sm:px-4 lg:px-5">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="grid size-10 place-items-center rounded-xl border border-slate-200/70 bg-white text-slate-700 transition-all hover:border-fuchsia-300 lg:hidden"
          aria-label={t('nav.openMenu')}
        >
          <Menu className="size-5" />
        </button>

        <Link to={PATHS.HOME} className="flex shrink-0 items-center gap-2">
          <span className="relative grid size-10 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)]">
            <Sparkles className="size-5" strokeWidth={2.5} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Nova<span className="text-gradient">Shop</span>
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:block">
              {t('brand.tagline')}
            </span>
          </div>
        </Link>

        <nav className="hidden shrink-0 items-center gap-0.5 lg:flex xl:gap-1">
          {CUSTOMER_NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === PATHS.HOME}
              className={({ isActive }) =>
                cx(
                  'relative whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-medium transition-colors xl:px-3',
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {t(link.labelKey)}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2">
          <div className="hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200/70 bg-white/60 px-3 md:flex">
            <Search className="size-4 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <kbd className="hidden shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 lg:inline">
              ⌘K
            </kbd>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <LanguageSwitcher />
            <Link
              to={PATHS.WISHLIST}
              className="relative grid size-10 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-fuchsia-50 hover:text-fuchsia-600"
              aria-label={t('nav.wishlist')}
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
              className="relative grid size-10 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-600"
              aria-label={t('nav.cart')}
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-linear-to-r from-fuchsia-500 to-purple-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to={PATHS.LOGIN}
              className="hidden h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200/80 bg-white px-3 text-sm font-semibold text-slate-700 transition-all hover:border-fuchsia-300 hover:text-fuchsia-600 lg:inline-flex"
            >
              <User className="size-4 shrink-0" />
              {t('auth.login')}
            </Link>
            <Link
              to={PATHS.REGISTER}
              className="hidden h-10 shrink-0 items-center whitespace-nowrap rounded-xl bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-3 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(217,70,239,0.6)] transition-all hover:scale-[1.03] active:scale-[0.98] lg:inline-flex"
            >
              {t('auth.register')}
            </Link>
          </div>
        </div>
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="left"
        width={300}
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
          <nav className="flex flex-col gap-1">
            {CUSTOMER_NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === PATHS.HOME}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'text-slate-700 hover:bg-white/60',
                  )
                }
              >
                {t(link.labelKey)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t border-white/40 pt-6">
            <div className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-700">
              <LanguageSwitcher className="size-10 border-slate-200/80" />
              <span>{t('common.language')}</span>
            </div>
            <Link
              to={PATHS.LOGIN}
              onClick={() => setMobileOpen(false)}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700"
            >
              {t('auth.login')}
            </Link>
            <Link
              to={PATHS.REGISTER}
              onClick={() => setMobileOpen(false)}
              className="rounded-2xl bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-md"
            >
              {t('auth.register')}
            </Link>
          </div>
        </div>
      </Drawer>
    </header>
  )
}
