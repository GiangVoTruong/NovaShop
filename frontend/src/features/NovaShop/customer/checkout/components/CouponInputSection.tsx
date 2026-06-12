import { formatCurrency } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import type { ValidateCouponResponse } from '@/types/coupon.types'
import { Input } from 'antd'
import { useTranslation } from 'react-i18next'

type CouponInputSectionProps = {
  couponCode: string
  onCouponCodeChange: (value: string) => void
  appliedCoupon: ValidateCouponResponse | null
  discountAmount: number
  onApply: () => void
  isApplying: boolean
  titleKey: string
  placeholderKey: string
  applyKey: string
  discountKey: string
}

export default function CouponInputSection({
  couponCode,
  onCouponCodeChange,
  appliedCoupon,
  discountAmount,
  onApply,
  isApplying,
  titleKey,
  placeholderKey,
  applyKey,
  discountKey,
}: CouponInputSectionProps) {
  const { t: translate } = useTranslation()

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-slate-900">{translate(titleKey)}</p>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <Input
            value={couponCode}
            onChange={(event) => onCouponCodeChange(event.target.value)}
            placeholder={translate(placeholderKey)}
            onPressEnter={onApply}
            className="w-full"
          />
        </div>
        <Button
          variant="blue"
          loading={isApplying}
          onClick={onApply}
          className="shrink-0 whitespace-nowrap"
        >
          {translate(applyKey)}
        </Button>
      </div>
      {appliedCoupon?.valid && (
        <p className="text-xs font-medium text-emerald-600">
          {translate(discountKey, { amount: formatCurrency(discountAmount) })}
        </p>
      )}
    </div>
  )
}
