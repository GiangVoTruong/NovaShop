import type { OrderStatus } from '../../shared/types'

export const CUSTOMER_ORDER_TABS: { id: 'all' | OrderStatus; labelKey: string }[] = [
  { id: 'all', labelKey: 'orders.tabs.all' },
  { id: 'pending', labelKey: 'orders.tabs.pending' },
  { id: 'shipping', labelKey: 'orders.tabs.shipping' },
  { id: 'delivered', labelKey: 'orders.tabs.delivered' },
  { id: 'cancelled', labelKey: 'orders.tabs.cancelled' },
]

export const ORDER_STATUS_ACCENT: Record<OrderStatus, string> = {
  awaiting_payment: 'border-l-rose-400',
  pending: 'border-l-amber-400',
  confirmed: 'border-l-indigo-400',
  packing: 'border-l-purple-400',
  shipping: 'border-l-cyan-400',
  delivered: 'border-l-emerald-400',
  delivered_pending_receiver_confirm: 'border-l-blue-400',
  cancelled: 'border-l-rose-400',
}

export const ORDER_STATUS_GLOW: Record<OrderStatus, string> = {
  awaiting_payment: 'from-rose-100/80 via-white/40 to-transparent',
  pending: 'from-amber-100/80 via-white/40 to-transparent',
  confirmed: 'from-indigo-100/80 via-white/40 to-transparent',
  packing: 'from-purple-100/80 via-white/40 to-transparent',
  shipping: 'from-cyan-100/80 via-white/40 to-transparent',
  delivered: 'from-emerald-100/80 via-white/40 to-transparent',
  delivered_pending_receiver_confirm: 'from-blue-100/80 via-white/40 to-transparent',
  cancelled: 'from-rose-100/80 via-white/40 to-transparent',
}
