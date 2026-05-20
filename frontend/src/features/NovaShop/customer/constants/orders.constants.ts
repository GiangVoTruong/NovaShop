import type { OrderStatus } from '../../shared/types'

export const CUSTOMER_ORDER_TABS: { id: 'all' | OrderStatus; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ xác nhận' },
  { id: 'shipping', label: 'Đang giao' },
  { id: 'delivered', label: 'Đã giao' },
  { id: 'cancelled', label: 'Đã huỷ' },
]
