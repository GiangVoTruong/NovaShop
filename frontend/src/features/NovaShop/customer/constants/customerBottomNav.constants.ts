import { PATHS } from '@/router/paths'
import { Heart, Home, Package, ShoppingCart, User } from 'lucide-react'

export const CUSTOMER_BOTTOM_NAV_ITEMS = [
  { to: PATHS.HOME, label: 'Home', icon: Home },
  { to: PATHS.PRODUCTS, label: 'Shop', icon: Package },
  { to: PATHS.WISHLIST, label: 'Wish', icon: Heart },
  { to: PATHS.CART, label: 'Cart', icon: ShoppingCart, showCart: true },
  { to: PATHS.PROFILE, label: 'Profile', icon: User },
]
