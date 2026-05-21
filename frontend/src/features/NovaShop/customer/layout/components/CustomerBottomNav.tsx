import { PATHS } from '@/router/paths'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { useShop } from '../../../shared/store/useShop'
import { cx } from '../../../shared/ui/cx'
import { CUSTOMER_BOTTOM_NAV_ITEMS } from '../constants/layout.constants'

export default function CustomerBottomNav() {
  const { t } = useTranslation()
  const { cartCount } = useShop()
  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-3 lg:hidden">
      <div className="mx-auto max-w-md rounded-3xl border border-white/60 bg-white/85 px-2 py-1.5 shadow-[0_20px_50px_-10px_rgba(168,85,247,0.35)] backdrop-blur-xl">
        <ul className="flex items-stretch justify-between">
          {CUSTOMER_BOTTOM_NAV_ITEMS.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.to === PATHS.HOME}
                className={({ isActive }) =>
                  cx(
                    'relative flex flex-col items-center gap-0.5 rounded-2xl py-2 text-[10px] font-semibold uppercase tracking-wider transition-all',
                    isActive ? 'text-white' : 'text-slate-500',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute inset-1 rounded-2xl bg-linear-to-br from-fuchsia-500 via-purple-500 to-indigo-500" />
                    )}
                    <item.icon className="relative size-5" />
                    {'showCart' in item && item.showCart && cartCount > 0 && (
                      <span className="absolute right-3 top-1 grid size-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                        {cartCount}
                      </span>
                    )}
                    <span className="relative">{t(item.labelKey)}</span>
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
