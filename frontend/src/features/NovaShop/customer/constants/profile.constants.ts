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
  { id: 'profile', label: 'Hồ sơ', icon: User, grad: 'from-fuchsia-500 to-purple-500' },
  { id: 'orders', label: 'Đơn hàng', icon: Package, grad: 'from-cyan-400 to-blue-500' },
  { id: 'wishlist', label: 'Yêu thích', icon: Heart, grad: 'from-rose-500 to-pink-500' },
  { id: 'address', label: 'Địa chỉ', icon: MapPin, grad: 'from-emerald-400 to-teal-500' },
  { id: 'payment', label: 'Thanh toán', icon: CreditCard, grad: 'from-amber-400 to-orange-500' },
  { id: 'notifications', label: 'Thông báo', icon: Bell, grad: 'from-purple-500 to-indigo-500' },
  { id: 'security', label: 'Bảo mật', icon: Lock, grad: 'from-slate-700 to-slate-900' },
]
