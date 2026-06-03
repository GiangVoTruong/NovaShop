import { PATHS } from '@/router/paths'
import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import NotificationBell from '@/features/NovaShop/shared/notifications/components/NotificationBell'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { useCartItemCount } from '@/features/NovaShop/customer/cart/hooks/useCart'
import { CUSTOMER_BOTTOM_NAV_ITEMS } from '../constants/layout.constants'

function CartBadge({ count }: { count: number }) {
  if (count <= 0) {
    return null
  }

  return (
    <span className="absolute -right-1.5 -top-1 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default function CustomerBottomNav() {
  const { t: translate } = useTranslation()
  const { isAuthenticated } = useAuth()
  const cartItemCount = useCartItemCount()

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-4 lg:hidden">
      <div className="customer-surface mx-auto max-w-md rounded-[1.75rem] px-2 py-2">
        <ul className="flex items-stretch justify-between gap-0.5">
          {CUSTOMER_BOTTOM_NAV_ITEMS.map((item) => (
            <li key={item.to} className="min-w-0 flex-1">
              <NavLink
                to={item.to}
                end={item.to === PATHS.HOME}
                className={({ isActive }) =>
                  cx(
                    'relative flex flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-semibold uppercase tracking-wider transition-all',
                    isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="customer-nav-pill absolute inset-1 rounded-2xl" />
                    )}
                    <span className="relative">
                      <item.icon className="size-5" />
                      {item.to === PATHS.CART && <CartBadge count={cartItemCount} />}
                    </span>
                    <span className="relative truncate px-0.5">{translate(item.labelKey)}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
          {isAuthenticated ? (
            <li className="min-w-0 flex-1">
              <NotificationBell layout="bottomNav" popoverPlacement="top" />
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  )
}
