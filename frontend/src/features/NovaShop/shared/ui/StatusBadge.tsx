import { useTranslation } from 'react-i18next'

import type { OrderStatus } from '../types'
import { ORDER_STATUS_TONE, PRODUCT_STATUS_TONE } from './statusBadge.constants'
import Badge from './Badge'
import { CATEGORY_TONE } from './categoryTokens'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useTranslation()

  return (
    <Badge tone={ORDER_STATUS_TONE[status]} dot>
      {t(`status.order.${status}`)}
    </Badge>
  )
}

export function ProductStatusBadge({
  status,
}: {
  status: keyof typeof PRODUCT_STATUS_TONE
}) {
  const { t } = useTranslation()

  return (
    <Badge tone={PRODUCT_STATUS_TONE[status]} dot>
      {t(`status.product.${status}`)}
    </Badge>
  )
}

export function CategoryTag({
  category,
}: {
  category: keyof typeof CATEGORY_TONE
}) {
  const { t } = useTranslation()

  return <Badge tone={CATEGORY_TONE[category]}>{t(`status.category.${category}`)}</Badge>
}
