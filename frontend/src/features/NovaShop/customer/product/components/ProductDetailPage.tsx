import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { PATHS } from '@/router/paths'
import { message, Spin } from 'antd'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { MAX_REVIEWS_PER_PRODUCT } from '@/types/review.types'
import { useAddToCart, useCart } from '../../cart/hooks/useCart'
import { startBuyNowSession } from '../../cart/lib/buyNowCart'
import { useCategorySlugMap } from '../../catalog/hooks/useCategorySlugMap'
import { useProductById, useProducts } from '../../catalog/hooks/useProducts'
import {
  getProductDiscountPercent,
  getProductImages,
  getProductListPrice,
  getProductSalePrice,
} from '../../catalog/lib/productApi'
import { useToggleWishlist } from '../../wishlist/hooks/useWishlist'
import { useCreateReview, useProductReviews } from '../hooks/useReviews'
import ProductCard from './ProductCard'
import ProductDetailGallery from './ProductDetailGallery'
import ProductDetailMobileBar from './ProductDetailMobileBar'
import ProductDetailPurchasePanel from './ProductDetailPurchasePanel'
import ProductDetailSkeleton from './ProductDetailSkeleton'
import ProductDetailTabsSection from './ProductDetailTabsSection'

export default function ProductDetailPage() {
  const { t: translate } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()
  const cartQuery = useCart()
  const addToCartMutation = useAddToCart()
  const { inWishlist, isPending: wishlistPending, toggle: toggleWishlist } = useToggleWishlist(id)
  const reviewsQuery = useProductReviews(id)
  const createReviewMutation = useCreateReview(id)
  const productQuery = useProductById(id)
  const product = productQuery.data
  const categorySlugById = useCategorySlugMap()

  const relatedCategorySlug = product?.categoryId
    ? categorySlugById.get(product.categoryId)
    : undefined

  const relatedQuery = useProducts({
    category: relatedCategorySlug,
    page: 0,
    size: 5,
    sortKey: 'popular',
    enabled: Boolean(relatedCategorySlug),
  })

  const [activeImage, setActiveImage] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [reviewRating, setReviewRating] = useState<number>(5)
  const [reviewComment, setReviewComment] = useState('')

  const related = useMemo(
    () =>
      product
        ? (relatedQuery.data?.data ?? []).filter((entry) => entry.id !== product.id).slice(0, 4)
        : [],
    [product, relatedQuery.data?.data],
  )

  const reviews = reviewsQuery.data ?? []
  const userReviewCount = useMemo(
    () => (user ? reviews.filter((review) => review.userId === user.id).length : 0),
    [reviews, user],
  )
  const canWriteReview = isAuthenticated && userReviewCount < MAX_REVIEWS_PER_PRODUCT

  if (productQuery.isLoading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center">
        <div className="customer-panel mx-auto max-w-md rounded-3xl p-10">
          <h1 className="text-2xl font-bold text-slate-900">
            {translate('product.detail.notFound')}
          </h1>
          <Link
            to={PATHS.PRODUCTS}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-600 hover:underline"
          >
            <ArrowLeft className="size-4" />
            {translate('product.detail.backToList')}
          </Link>
        </div>
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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      requireLogin()
      return
    }
    if (stock <= 0) return

    addToCartMutation.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          message.success(translate('product.detail.messages.addedToCart'))
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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      requireLogin()
      return
    }
    if (stock <= 0) {
      return
    }

    startBuyNowSession(product.id, quantity, cartQuery.data)
    navigate(PATHS.CHECKOUT)
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
        onError: (error: unknown) => {
          const messageText =
            error &&
            typeof error === 'object' &&
            'response' in error &&
            error.response &&
            typeof error.response === 'object' &&
            'data' in error.response &&
            error.response.data &&
            typeof error.response.data === 'object' &&
            'message' in error.response.data &&
            typeof error.response.data.message === 'string'
              ? error.response.data.message
              : null

          if (messageText?.includes('at most 3')) {
            message.error(translate('product.detail.reviewsSection.limitReached', { max: MAX_REVIEWS_PER_PRODUCT }))
            return
          }
          message.error(translate('product.detail.reviewsSection.error'))
        },
      },
    )
  }

  return (
    <div className="pb-28 lg:pb-12">
      <div className="mx-auto max-w-[1440px] space-y-12 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-16 lg:px-10 xl:px-14">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
          <Link to={PATHS.HOME} className="transition-colors hover:text-fuchsia-600">
            {translate('product.detail.breadcrumb.home')}
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-slate-300" />
          <Link to={PATHS.PRODUCTS} className="transition-colors hover:text-fuchsia-600">
            {translate('product.detail.breadcrumb.products')}
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-slate-300" />
          <span className="line-clamp-1 font-medium text-slate-900">{product.name}</span>
        </nav>

        <div className="customer-panel overflow-hidden rounded-3xl lg:rounded-4xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-5 sm:p-6 lg:p-7">
              <ProductDetailGallery
                images={images}
                productName={product.name}
                discount={discount}
                activeImage={activeImage}
                onSelectImage={setActiveImage}
              />
            </div>

            <div className="border-t border-slate-100 p-5 sm:p-7 lg:border-t-0 lg:pt-7">
              <ProductDetailPurchasePanel
                product={product}
                salePrice={salePrice}
                listPrice={listPrice}
                discount={discount}
                stock={stock}
                quantity={quantity}
                inWishlist={inWishlist}
                wishlistPending={wishlistPending}
                cartPending={addToCartMutation.isPending}
                onDecreaseQuantity={() => setQuantity((value) => Math.max(1, value - 1))}
                onIncreaseQuantity={() => setQuantity((value) => Math.min(stock, value + 1))}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>
          </div>
        </div>

        <ProductDetailTabsSection
          product={product}
          stock={stock}
          reviews={reviews}
          reviewsLoading={reviewsQuery.isLoading}
          reviewRating={reviewRating}
          reviewComment={reviewComment}
          reviewSubmitting={createReviewMutation.isPending}
          canWriteReview={canWriteReview}
          userReviewCount={userReviewCount}
          maxReviews={MAX_REVIEWS_PER_PRODUCT}
          onReviewRatingChange={setReviewRating}
          onReviewCommentChange={setReviewComment}
          onSubmitReview={handleSubmitReview}
        />

        <section className="customer-scroll-section">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
                {translate('product.detail.related.eyebrow')}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {translate('product.detail.related.title')}
              </h2>
            </div>
          </div>

          {relatedQuery.isLoading ? (
            <div className="flex justify-center py-16">
              <Spin size="large" />
            </div>
          ) : related.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              {translate('product.detail.related.empty')}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {related.map((entry) => (
                <ProductCard key={entry.id} product={entry} />
              ))}
            </div>
          )}
        </section>
      </div>

      <ProductDetailMobileBar
        salePrice={salePrice}
        stock={stock}
        inWishlist={inWishlist}
        wishlistPending={wishlistPending}
        cartPending={addToCartMutation.isPending}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  )
}
