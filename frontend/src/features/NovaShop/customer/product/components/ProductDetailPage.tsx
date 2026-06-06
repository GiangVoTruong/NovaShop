import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { formatCurrency, formatDate } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import StarRating from '@/features/NovaShop/shared/ui/StarRating'
import { CategoryTag } from '@/features/NovaShop/shared/ui/StatusBadge'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { PATHS } from '@/router/paths'
import { message, Spin } from 'antd'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAddToCart } from '../../cart/hooks/useCart'
import { useCategories } from '../../catalog/hooks/useCategories'
import { useProductById, useProducts } from '../../catalog/hooks/useProducts'
import { buildCategorySlugMap } from '../../catalog/lib/categoryApi'
import {
  getProductCategorySlug,
  getProductDiscountPercent,
  getProductImages,
  getProductListPrice,
  getProductRating,
  getProductSalePrice,
} from '../../catalog/lib/productApi'
import { useToggleWishlist } from '../../wishlist/hooks/useWishlist'
import { useCreateReview, useProductReviews } from '../hooks/useReviews'
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
  const { t: translate } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const addToCartMutation = useAddToCart()
  const { inWishlist, isPending: wishlistPending, toggle: toggleWishlist } = useToggleWishlist(id)
  const reviewsQuery = useProductReviews(id)
  const createReviewMutation = useCreateReview(id)
  const productQuery = useProductById(id)
  const product = productQuery.data
  const categoriesQuery = useCategories()
  const categorySlugById = useMemo(
    () => buildCategorySlugMap(categoriesQuery.data ?? []),
    [categoriesQuery.data],
  )
  const productCategorySlug = product
    ? getProductCategorySlug(product, categorySlugById)
    : undefined
  const relatedQuery = useProducts({
    category: productCategorySlug,
    page: 0,
    size: 5,
    sortKey: 'popular',
    enabled: Boolean(productCategorySlug),
  })
  const [activeImage, setActiveImage] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [reviewRating, setReviewRating] = useState<number>(5)
  const [reviewComment, setReviewComment] = useState('')

  const related = product
    ? (relatedQuery.data?.data ?? []).filter((entry) => entry.id !== product.id).slice(0, 4)
    : []

  if (productQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{translate('product.detail.notFound')}</h1>
        <Link
          to={PATHS.PRODUCTS}
          className="mt-4 inline-flex items-center gap-2 text-fuchsia-600 hover:underline"
        >
          <ArrowLeft className="size-4" /> {translate('product.detail.backToList')}
        </Link>
      </div>
    )
  }

  const images = getProductImages(product)
  const salePrice = getProductSalePrice(product)
  const listPrice = getProductListPrice(product)
  const discount = getProductDiscountPercent(product)
  const stock = product.stock ?? 0

  const requireLogin = () => {
    navigate(PATHS.LOGIN, { state: { from: location.pathname } })
  }

  const handleAddToCart = (redirectToCheckout = false) => {
    if (!isAuthenticated) {
      requireLogin()
      return
    }

    if (stock <= 0) {
      return
    }

    addToCartMutation.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          message.success(translate('product.detail.messages.addedToCart'))
          if (redirectToCheckout) {
            navigate(PATHS.CHECKOUT)
          }
        },
      },
    )
  }

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      requireLogin()
      return
    }

    toggleWishlist()
  }

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      requireLogin()
      return
    }

    createReviewMutation.mutate(
      { rating: reviewRating, comment: reviewComment.trim() || undefined },
      {
        onSuccess: () => {
          message.success(translate('product.detail.reviewsSection.success'))
          setReviewComment('')
        },
        onError: () => message.error(translate('product.detail.reviewsSection.error')),
      },
    )
  }

  const reviews = reviewsQuery.data ?? []

  return (
    <div className="mx-auto max-w-[1440px] space-y-16 px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link to={PATHS.HOME} className="hover:text-fuchsia-600">
          {translate('product.detail.breadcrumb.home')}
        </Link>
        <ChevronRight className="size-3.5" />
        <Link to={PATHS.PRODUCTS} className="hover:text-fuchsia-600">
          {translate('product.detail.breadcrumb.products')}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-slate-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* GALLERY */}
        <section className="space-y-4">
          <div className="group relative overflow-hidden rounded-4xl border border-white/60 bg-white/70 p-2 backdrop-blur-xl glow-purple">
            <div className="relative aspect-4/5 max-h-[600px] overflow-hidden rounded-3xl bg-slate-100 sm:aspect-square">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {discount > 0 && (
              <span className="absolute left-6 top-6 rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-pink-500/40">
                -{discount}% OFF
              </span>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((imageUrl, imageIndex) => (
              <button
                key={imageUrl}
                type="button"
                onClick={() => setActiveImage(imageIndex)}
                className={cx(
                  'size-24 shrink-0 overflow-hidden rounded-2xl transition-all',
                  activeImage === imageIndex
                    ? 'ring-2 ring-fuchsia-500 ring-offset-2'
                    : 'opacity-60 hover:opacity-100',
                )}
              >
                <img src={imageUrl} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* INFO */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <CategoryTag category={productCategorySlug ?? 'electronics'} />
              <span className="text-sm font-medium text-slate-500">· {product.sellerName}</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <StarRating value={getProductRating(product)} size={18} showValue />
              <span className="text-slate-400">·</span>
              <span>
                {translate('product.detail.reviews', {
                  count: product.reviewCount.toLocaleString(),
                })}
              </span>
              <span className="text-slate-400">·</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                <CheckCircle2 className="size-4" /> {translate('product.detail.sold')}
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-fuchsia-100 bg-linear-to-br from-fuchsia-50 via-purple-50 to-cyan-50 p-6">
            <div className="absolute -right-10 -top-10 size-32 rounded-full bg-fuchsia-300/30 blur-3xl" />
            <div className="relative flex items-baseline gap-3">
              <span className="text-4xl font-extrabold tracking-tight text-gradient">
                {formatCurrency(salePrice)}
              </span>
              {discount > 0 && (
                <span className="text-lg text-slate-400 line-through">
                  {formatCurrency(listPrice)}
                </span>
              )}
            </div>
            <p className="relative mt-1 text-xs text-slate-500">
              {translate('product.detail.priceNote')}{' '}
              {discount > 0 ? formatCurrency(listPrice - salePrice) : '—'}
            </p>
          </div>

          <p className="text-[15px] leading-relaxed text-slate-600">{product.description}</p>

          <div className="flex items-center gap-4">
            <p className="text-sm font-bold text-slate-900">
              {translate('product.detail.quantity')}
            </p>
            <div className="flex items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="grid size-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label={translate('product.detail.decrease')}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(stock, value + 1))}
                className="grid size-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label={translate('product.detail.increase')}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {translate('product.detail.stockLeft', { count: stock })}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              glow
              fullWidth
              loading={addToCartMutation.isPending}
              disabled={stock <= 0}
              onClick={() => handleAddToCart(false)}
            >
              {translate('product.detail.addToCart')}
            </Button>
            <Button
              size="lg"
              variant="dark"
              fullWidth
              loading={addToCartMutation.isPending}
              disabled={stock <= 0}
              onClick={() => handleAddToCart(true)}
            >
              {translate('product.detail.buyNow')}
            </Button>
            <button
              type="button"
              className={cx(
                'grid h-13 w-13 shrink-0 place-items-center rounded-2xl border-2 bg-white transition-colors',
                inWishlist
                  ? 'border-rose-300 text-rose-500 hover:border-rose-400'
                  : 'border-slate-200 text-slate-600 hover:border-slate-900',
              )}
              aria-label={
                inWishlist
                  ? translate('product.card.removeFromWishlist')
                  : translate('product.card.addToWishlist')
              }
              disabled={wishlistPending}
              onClick={handleToggleWishlist}
            >
              <Heart className={cx('size-5', inWishlist && 'fill-current')} />
            </button>
            <button
              type="button"
              className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-900"
              aria-label={translate('product.detail.share')}
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
                  <p className="text-xs text-slate-500">{translate(entry.labelKey)}</p>
                  <p className="text-sm font-bold text-slate-900">{translate(entry.valueKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-4xl border border-slate-200/60 bg-white/85 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {translate('product.detail.description.title')}
        </h2>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate-600">
          <p>{product.description}</p>
          <p>{translate('product.detail.description.extra')}</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              {translate('product.detail.description.sku')}: {product.slug}
            </li>
            <li>
              {translate('product.detail.description.stock')}:{' '}
              {translate('product.detail.description.stockValue', { count: stock })}
            </li>
            <li>
              {translate('product.detail.description.origin')}:{' '}
              {translate('product.detail.description.originValue')}
            </li>
          </ul>
        </div>
      </section>

      <section className="rounded-4xl border border-slate-200/60 bg-white/85 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {translate('product.detail.reviewsSection.title')}
        </h2>

        {reviewsQuery.isLoading ? (
          <div className="mt-6 flex justify-center">
            <Spin />
          </div>
        ) : reviews.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            {translate('product.detail.reviewsSection.empty')}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-slate-900">{review.userFullName}</p>
                  <StarRating value={review.rating} size={14} />
                </div>
                {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
                <p className="mt-2 text-xs text-slate-400">{formatDate(review.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-900">
            {translate('product.detail.reviewsSection.writeTitle')}
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm text-slate-600" htmlFor="review-rating">
              {translate('product.detail.reviewsSection.rating')}
            </label>
            <select
              id="review-rating"
              value={reviewRating}
              onChange={(event) => setReviewRating(Number(event.target.value))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} ★
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={reviewComment}
            onChange={(event) => setReviewComment(event.target.value)}
            placeholder={translate('product.detail.reviewsSection.commentPlaceholder')}
            rows={3}
            className="mt-4 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-fuchsia-500 focus:outline-none"
          />
          <Button
            className="mt-4"
            glow
            loading={createReviewMutation.isPending}
            onClick={handleSubmitReview}
          >
            {translate('product.detail.reviewsSection.submit')}
          </Button>
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          {translate('product.detail.related.eyebrow')}
        </p>
        <h2 className="mt-2 mb-8 text-3xl font-extrabold tracking-tight text-slate-900">
          {translate('product.detail.related.title')}
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
