import { useMemo, useState } from 'react'
import { message } from 'antd'
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PATHS, productDetailPath } from '@/router/paths'
import { PRODUCTS } from '../../../shared/data/products'
import { useShop } from '../../../shared/store/useShop'
import { formatCurrency } from '../../../shared/format'
import Button from '../../../shared/ui/Button'
import EmptyState from '../../../shared/ui/EmptyState'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, clearCart } = useShop()
  const [couponCode, setCouponCode] = useState<string>('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const lines = useMemo(
    () =>
      cart
        .map((line) => {
          const product = PRODUCTS.find((entry) => entry.id === line.productId)
          if (!product) return null
          return { ...line, product }
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    [cart],
  )

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  )
  const shipping = subtotal === 0 ? 0 : subtotal >= 500000 ? 0 : 30000
  const discount = appliedCoupon === 'NOVA20' ? subtotal * 0.2 : 0
  const total = Math.max(0, subtotal + shipping - discount)

  const handleApplyCoupon = () => {
    if (!couponCode) return
    if (couponCode.toUpperCase() === 'NOVA20') {
      setAppliedCoupon('NOVA20')
      message.success('Đã áp dụng mã NOVA20 — giảm 20%')
    } else {
      message.error('Mã giảm giá không hợp lệ')
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="size-7" />}
          title="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ hàng. Khám phá ngay những món đồ thú vị nào!"
          action={
            <Link to={PATHS.PRODUCTS}>
              <Button rightIcon={<ArrowRight className="size-4" />} glow>
                Tiếp tục mua sắm
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          Checkout step 1/2
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Giỏ hàng <span className="text-gradient">của bạn</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Bạn có {lines.length} sản phẩm — kiểm tra trước khi thanh toán nhé
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {lines.map((line) => (
            <article
              key={line.productId}
              className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl transition-all hover:shadow-lg sm:flex-row"
            >
              <Link
                to={productDetailPath(line.productId)}
                className="size-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100"
              >
                <img
                  src={line.product.images[0]}
                  alt={line.product.name}
                  className="size-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {line.product.brand}
                    </p>
                    <Link
                      to={productDetailPath(line.productId)}
                      className="text-base font-bold tracking-tight text-slate-900 hover:text-fuchsia-600"
                    >
                      {line.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-400">
                      SKU: {line.product.sku}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.productId)}
                    className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                    aria-label="Xóa"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
                  <div className="flex items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(line.productId, line.quantity - 1)
                      }
                      className="grid size-8 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
                      aria-label="Giảm"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(line.productId, line.quantity + 1)
                      }
                      className="grid size-8 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
                      aria-label="Tăng"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <p className="text-xl font-extrabold tracking-tight text-gradient">
                    {formatCurrency(line.product.price * line.quantity)}
                  </p>
                </div>
              </div>
            </article>
          ))}
          <div className="flex justify-between text-sm">
            <Link
              to={PATHS.PRODUCTS}
              className="font-semibold text-fuchsia-600 hover:underline"
            >
              ← Tiếp tục mua sắm
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="font-medium text-slate-500 hover:text-rose-500"
            >
              Xóa toàn bộ
            </button>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl glow-purple">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-fuchsia-300/30 blur-2xl" />
              <h2 className="relative text-lg font-extrabold tracking-tight text-slate-900">
                Tóm tắt đơn hàng
              </h2>
              <dl className="relative mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Tạm tính</dt>
                  <dd className="font-bold text-slate-900">
                    {formatCurrency(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Phí vận chuyển</dt>
                  <dd className="font-bold text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Miễn phí</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <dt>Giảm giá ({appliedCoupon})</dt>
                    <dd className="font-bold">-{formatCurrency(discount)}</dd>
                  </div>
                )}
                <div className="border-t border-dashed border-slate-200 pt-3" />
                <div className="flex items-baseline justify-between">
                  <dt className="font-bold text-slate-900">Tổng cộng</dt>
                  <dd className="text-2xl font-extrabold tracking-tight text-gradient">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>
              <Button
                size="lg"
                fullWidth
                glow
                className="relative mt-6"
                onClick={() => navigate(PATHS.CHECKOUT)}
                rightIcon={<ArrowRight className="size-4" />}
              >
                Thanh toán
              </Button>
              <p className="relative mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Truck className="size-3.5" /> Miễn phí ship đơn từ 500K
              </p>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-amber-400 to-orange-500 text-white">
                  <Tag className="size-3.5" />
                </span>
                Mã giảm giá
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Nhập mã (vd: NOVA20)"
                  className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
                />
                <Button onClick={handleApplyCoupon} size="md">
                  Áp dụng
                </Button>
              </div>
              <p className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                <Sparkles className="size-3" /> Thử mã{' '}
                <code className="rounded bg-fuchsia-100 px-1.5 py-0.5 font-mono font-bold text-fuchsia-700">
                  NOVA20
                </code>{' '}
                để giảm 20%
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
