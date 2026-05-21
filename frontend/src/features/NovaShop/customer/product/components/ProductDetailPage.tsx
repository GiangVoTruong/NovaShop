import { useMemo, useState } from 'react'
import { message } from 'antd'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Share2,
  Sparkles,
  Truck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import { PRODUCTS } from '../../../shared/data/products'
import { useShop } from '../../../shared/store/useShop'
import { formatCurrency } from '../../../shared/format'
import Button from '../../../shared/ui/Button'
import StarRating from '../../../shared/ui/StarRating'
import { CategoryTag } from '../../../shared/ui/StatusBadge'
import { cx } from '../../../shared/ui/cx'
import ProductCard from './ProductCard'

const DETAIL_PERKS = [
  {
    icon: Truck,
    labelKey: 'product.detail.perks.delivery.label',
    valueKey: 'product.detail.perks.delivery.value',
    grad: 'from-cyan-400 to-blue-500',
  },
  {
    icon: ShieldCheck,
    labelKey: 'product.detail.perks.warranty.label',
    valueKey: 'product.detail.perks.warranty.value',
    grad: 'from-emerald-400 to-teal-500',
  },
  {
    icon: RotateCcw,
    labelKey: 'product.detail.perks.returns.label',
    valueKey: 'product.detail.perks.returns.value',
    grad: 'from-fuchsia-500 to-pink-500',
  },
] as const

export default function ProductDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = PRODUCTS.find((entry) => entry.id === id)
  const { addToCart, toggleWishlist, isWished } = useShop()
  const [activeImage, setActiveImage] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0],
  )
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes?.[0],
  )

  const related = useMemo(() => {
    if (!product) return []
    return PRODUCTS.filter(
      (entry) => entry.category === product.category && entry.id !== product.id,
    ).slice(0, 4)
  }, [product])

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{t('product.detail.notFound')}</h1>
        <Link
          to={PATHS.PRODUCTS}
          className="mt-4 inline-flex items-center gap-2 text-fuchsia-600 hover:underline"
        >
          <ArrowLeft className="size-4" /> {t('product.detail.backToList')}
        </Link>
      </div>
    )
  }

  const wished = isWished(product.id)
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0

  const handleAddToCart = () => {
    addToCart(product.id, quantity)
    message.success(t('product.detail.messages.addedToCart'))
  }

  const handleBuyNow = () => {
    addToCart(product.id, quantity)
    navigate(PATHS.CHECKOUT)
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-16 px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link to={PATHS.HOME} className="hover:text-fuchsia-600">
          {t('product.detail.breadcrumb.home')}
        </Link>
        <ChevronRight className="size-3.5" />
        <Link to={PATHS.PRODUCTS} className="hover:text-fuchsia-600">
          {t('product.detail.breadcrumb.products')}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-slate-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* GALLERY */}
        <section className="space-y-4">
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-2 backdrop-blur-xl glow-purple">
            <div className="overflow-hidden rounded-3xl bg-slate-100">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-[480px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[600px]"
              />
            </div>
            {discount > 0 && (
              <span className="absolute left-6 top-6 rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-pink-500/40">
                -{discount}% OFF
              </span>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images.map((src, idx) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(idx)}
                className={cx(
                  'size-24 shrink-0 overflow-hidden rounded-2xl transition-all',
                  activeImage === idx
                    ? 'ring-2 ring-fuchsia-500 ring-offset-2'
                    : 'opacity-60 hover:opacity-100',
                )}
              >
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* INFO */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <CategoryTag category={product.category} />
              <span className="text-sm font-medium text-slate-500">
                · {product.brand}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <StarRating value={product.rating} size={18} showValue />
              <span className="text-slate-400">·</span>
              <span>
                {t('product.detail.reviews', {
                  count: product.reviewCount.toLocaleString(),
                })}
              </span>
              <span className="text-slate-400">·</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                <CheckCircle2 className="size-4" /> {t('product.detail.sold')}
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-fuchsia-100 bg-linear-to-br from-fuchsia-50 via-purple-50 to-cyan-50 p-6">
            <div className="absolute -right-10 -top-10 size-32 rounded-full bg-fuchsia-300/30 blur-3xl" />
            <div className="relative flex items-baseline gap-3">
              <span className="text-4xl font-extrabold tracking-tight text-gradient">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="relative mt-1 text-xs text-slate-500">
              {t('product.detail.priceNote')}{' '}
              {product.originalPrice
                ? formatCurrency(product.originalPrice - product.price)
                : '—'}
            </p>
          </div>

          <p className="text-[15px] leading-relaxed text-slate-600">
            {product.description}
          </p>

          {product.colors && (
            <div>
              <p className="mb-3 text-sm font-bold text-slate-900">{t('product.detail.color')}</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cx(
                      'size-11 rounded-2xl border-2 transition-all',
                      selectedColor === color
                        ? 'border-slate-900 ring-2 ring-offset-2 ring-fuchsia-500'
                        : 'border-slate-200 hover:scale-110',
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div>
              <p className="mb-3 text-sm font-bold text-slate-900">{t('product.detail.size')}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cx(
                      'h-11 min-w-14 rounded-2xl border-2 px-4 text-sm font-bold transition-all',
                      selectedSize === size
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-900',
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <p className="text-sm font-bold text-slate-900">{t('product.detail.quantity')}</p>
            <div className="flex items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="grid size-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label={t('product.detail.decrease')}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((value) => Math.min(product.stock, value + 1))
                }
                className="grid size-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label={t('product.detail.increase')}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {t('product.detail.stockLeft', { count: product.stock })}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              fullWidth
              glow
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              leftIcon={<Sparkles className="size-4" />}
            >
              {t('product.detail.addToCart')}
            </Button>
            <Button
              size="lg"
              variant="dark"
              fullWidth
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              {t('product.detail.buyNow')}
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={cx(
                'grid h-13 w-13 shrink-0 place-items-center rounded-2xl border-2 transition-all',
                wished
                  ? 'border-transparent bg-linear-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-pink-500/40'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:text-rose-500',
              )}
              aria-label={t('product.detail.wishlist')}
            >
              <Heart className={cx('size-5', wished && 'fill-white')} />
            </button>
            <button
              type="button"
              className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-900"
              aria-label={t('product.detail.share')}
            >
              <Share2 className="size-5" />
            </button>
          </div>

          <div className="grid gap-3 rounded-3xl border border-slate-200/60 bg-white/85 p-5 backdrop-blur-xl sm:grid-cols-3">
            {DETAIL_PERKS.map((entry) => (
              <div key={entry.labelKey} className="flex items-center gap-3">
                <span
                  className={`grid size-10 place-items-center rounded-xl bg-linear-to-br ${entry.grad} text-white shadow-md`}
                >
                  <entry.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-slate-500">{t(entry.labelKey)}</p>
                  <p className="text-sm font-bold text-slate-900">{t(entry.valueKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[2rem] border border-slate-200/60 bg-white/85 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {t('product.detail.description.title')}
        </h2>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate-600">
          <p>{product.description}</p>
          <p>{t('product.detail.description.extra')}</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              {t('product.detail.description.sku')}: {product.sku}
            </li>
            <li>
              {t('product.detail.description.stock')}:{' '}
              {t('product.detail.description.stockValue', { count: product.stock })}
            </li>
            <li>
              {t('product.detail.description.origin')}: {t('product.detail.description.originValue')}
            </li>
          </ul>
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {t('product.detail.related.eyebrow')}
        </p>
        <h2 className="mt-2 mb-8 text-3xl font-extrabold tracking-tight text-slate-900">
          {t('product.detail.related.title')}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {related.map((entry) => (
            <ProductCard key={entry.id} product={entry} />
          ))}
        </div>
      </section>
    </div>
  )
}
