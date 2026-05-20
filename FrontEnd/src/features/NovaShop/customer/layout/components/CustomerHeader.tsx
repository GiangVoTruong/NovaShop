import { PATHS } from '@/router/paths'
import { Drawer } from 'antd'
import { Heart, Menu, Search, ShoppingBag, ShoppingCart, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useShop } from '../../../shared/store/useShop'
import { cx } from '../../../shared/ui/cx'
import { CUSTOMER_NAV_LINKS } from '../constants/layout.constants'

export default function CustomerHeader() {
  const { cartCount, wishlistCount } = useShop()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-3 rounded-2xl border border-white/60 bg-white/75 px-4 shadow-[0_10px_40px_-15px_rgba(168,85,247,0.25)] backdrop-blur-xl sm:gap-4 sm:px-5">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="grid size-10 place-items-center rounded-xl border border-slate-200/70 bg-white text-slate-700 transition-all hover:border-fuchsia-300 lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="size-5" />
        </button>

        <Link to={PATHS.HOME} className="flex items-center gap-2">
          <span className="relative grid size-10 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-[0_8px_24px_-8px_rgba(217,70,239,0.6)]">
            <Sparkles className="size-5" strokeWidth={2.5} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Nova<span className="text-gradient">Shop</span>
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:block">
              future commerce
            </span>
          </div>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {CUSTOMER_NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === PATHS.HOME}
              className={({ isActive }) =>
                cx(
                  'relative rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden flex-1 max-w-md items-center gap-2 rounded-xl border border-slate-200/70 bg-white/60 px-3 md:flex">
          <Search className="size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm sản phẩm, thương hiệu…"
            className="h-10 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 sm:inline">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <Link
            to={PATHS.WISHLIST}
            className="relative grid size-10 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-fuchsia-50 hover:text-fuchsia-600"
            aria-label="Yêu thích"
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
            aria-label="Giỏ hàng"
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
            className="ml-1 hidden h-10 items-center gap-2 rounded-xl bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(217,70,239,0.6)] transition-all hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
          >
            <User className="size-4" />
            Đăng nhập
          </Link>
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
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </Drawer>
    </header>
  )
}
