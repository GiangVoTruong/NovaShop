import {
  Bell,
  CreditCard,
  Heart,
  Lock,
  MapPin,
  Package,
  User,
} from 'lucide-react'

export const PROFILE_TABS = [
  { id: 'profile', labelKey: 'profile.tabs.profile', icon: User, grad: 'from-fuchsia-500 to-purple-500' },
  { id: 'orders', labelKey: 'profile.tabs.orders', icon: Package, grad: 'from-cyan-400 to-blue-500' },
  { id: 'wishlist', labelKey: 'profile.tabs.wishlist', icon: Heart, grad: 'from-rose-500 to-pink-500' },
  { id: 'address', labelKey: 'profile.tabs.address', icon: MapPin, grad: 'from-emerald-400 to-teal-500' },
  { id: 'payment', labelKey: 'profile.tabs.payment', icon: CreditCard, grad: 'from-amber-400 to-orange-500' },
  { id: 'notifications', labelKey: 'profile.tabs.notifications', icon: Bell, grad: 'from-purple-500 to-indigo-500' },
  { id: 'security', labelKey: 'profile.tabs.security', icon: Lock, grad: 'from-slate-700 to-slate-900' },
] as const
