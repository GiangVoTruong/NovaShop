import type { OrderStatus } from '../../shared/types'

export const CUSTOMER_ORDER_TABS: { id: 'all' | OrderStatus; labelKey: string }[] = [
  { id: 'all', labelKey: 'orders.tabs.all' },
  { id: 'pending', labelKey: 'orders.tabs.pending' },
  { id: 'shipping', labelKey: 'orders.tabs.shipping' },
  { id: 'delivered', labelKey: 'orders.tabs.delivered' },
  { id: 'cancelled', labelKey: 'orders.tabs.cancelled' },
]
