import { PATHS } from '@/router/paths'
import { Heart, Home, Package, ShoppingCart, User } from 'lucide-react'

export const CUSTOMER_BOTTOM_NAV_ITEMS = [
  { to: PATHS.HOME, labelKey: 'bottomNav.home', icon: Home },
  { to: PATHS.PRODUCTS, labelKey: 'bottomNav.shop', icon: Package },
  { to: PATHS.WISHLIST, labelKey: 'bottomNav.wish', icon: Heart },
  { to: PATHS.CART, labelKey: 'bottomNav.cart', icon: ShoppingCart, showCart: true },
  { to: PATHS.PROFILE, labelKey: 'bottomNav.profile', icon: User },
] as const
