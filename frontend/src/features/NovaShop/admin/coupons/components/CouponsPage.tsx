import { Plus } from 'lucide-react'
import { COUPONS } from '../../../shared/data/coupons'
import { formatCurrency, formatDate } from '../../../shared/format'
import type { Coupon } from '../../../shared/types'
import Badge from '../../../shared/ui/Badge'
import Button from '../../../shared/ui/Button'
import AdminPageHeader from '../../layout/components/AdminPageHeader'

const COUPON_STATUS_LABEL = {
  active: 'Đang hoạt động',
  expired: 'Đã hết hạn',
  paused: 'Tạm dừng',
} as const

const COUPON_STATUS_TONE = {
  active: 'emerald',
  expired: 'rose',
  paused: 'amber',
} as const

export default function CouponsPage() {
  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow="Mã giảm giá"
        title={
          <>
            Khuyến mãi <span className="text-gradient">& coupon</span>
          </>
        }
        description="Tạo và quản lý mã giảm giá cho chiến dịch marketing."
        actions={
          <Button leftIcon={<Plus className="size-4" />}>Tạo mã mới</Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {COUPONS.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
  )
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const usagePercent = Math.round((coupon.used / coupon.limit) * 100)
  const discountLabel =
    coupon.type === 'percent'
      ? `Giảm ${coupon.value}%`
      : `Giảm ${formatCurrency(coupon.value)}`

  return (
    <article className="glass-dark rounded-3xl p-5 ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xl font-extrabold tracking-tight text-white">
            {coupon.code}
          </p>
          <p className="mt-1 text-sm text-fuchsia-300">{discountLabel}</p>
        </div>
        <Badge tone={COUPON_STATUS_TONE[coupon.status]} dot>
          {COUPON_STATUS_LABEL[coupon.status]}
        </Badge>
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <dt>Đơn tối thiểu</dt>
          <dd className="font-semibold text-slate-200">
            {coupon.minOrder > 0 ? formatCurrency(coupon.minOrder) : 'Không'}
          </dd>
        </div>
        <div className="flex justify-between text-slate-400">
          <dt>Hết hạn</dt>
          <dd className="font-semibold text-slate-200">{formatDate(coupon.expiresAt)}</dd>
        </div>
        <div className="flex justify-between text-slate-400">
          <dt>Đã dùng</dt>
          <dd className="font-semibold text-slate-200">
            {coupon.used} / {coupon.limit}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Tiến độ sử dụng</span>
          <span>{usagePercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-linear-to-r from-fuchsia-500 to-indigo-500"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Button variant="outline" size="sm" fullWidth>
          Sửa
        </Button>
        <Button variant="ghost" size="sm" fullWidth>
          {coupon.status === 'paused' ? 'Kích hoạt' : 'Tạm dừng'}
        </Button>
      </div>
    </article>
  )
}
