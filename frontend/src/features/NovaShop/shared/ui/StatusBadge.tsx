import type { OrderStatus } from '../types'
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_TONE,
} from './statusBadge.constants'
import Badge from './Badge'
import { CATEGORY_LABEL, CATEGORY_TONE } from './categoryTokens'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge tone={ORDER_STATUS_TONE[status]} dot>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  )
}

export function ProductStatusBadge({
  status,
}: {
  status: keyof typeof PRODUCT_STATUS_LABEL
}) {
  return (
    <Badge tone={PRODUCT_STATUS_TONE[status]} dot>
      {PRODUCT_STATUS_LABEL[status]}
    </Badge>
  )
}

export function CategoryTag({
  category,
}: {
  category: keyof typeof CATEGORY_TONE
}) {
  return <Badge tone={CATEGORY_TONE[category]}>{CATEGORY_LABEL[category]}</Badge>
}
