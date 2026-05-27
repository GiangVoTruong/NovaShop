import { PATHS } from '@/router/paths'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { useShop } from '@/features/NovaShop/shared/store/useShop'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { CUSTOMER_BOTTOM_NAV_ITEMS } from '../constants/layout.constants'

export default function CustomerBottomNav() {
  const { t: translate } = useTranslation()
  const { cartCount } = useShop()

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-4 lg:hidden">
      <div className="customer-surface mx-auto max-w-md rounded-[1.75rem] px-2 py-2">
        <ul className="flex items-stretch justify-between">
          {CUSTOMER_BOTTOM_NAV_ITEMS.map((item) => (
            <li key={item.to} className="flex-1">
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
                    <item.icon className="relative size-5" />
                    {'showCart' in item && item.showCart && cartCount > 0 && (
                      <span className="absolute right-3 top-1 grid size-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                        {cartCount}
                      </span>
                    )}
                    <span className="relative">{translate(item.labelKey)}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
