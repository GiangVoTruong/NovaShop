import { formatDate } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import StarRating from '@/features/NovaShop/shared/ui/StarRating'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import type { ApiProductResponse } from '@/types/product.types'
import { Spin } from 'antd'
import { MessageSquare, Star } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ApiReviewResponse } from '@/types/review.types'

type DetailTab = 'description' | 'reviews'

interface ProductDetailTabsSectionProps {
  product: ApiProductResponse
  stock: number
  reviews: ApiReviewResponse[]
  reviewsLoading: boolean
  reviewRating: number
  reviewComment: string
  reviewSubmitting: boolean
  onReviewRatingChange: (rating: number) => void
  onReviewCommentChange: (comment: string) => void
  onSubmitReview: () => void
}

export default function ProductDetailTabsSection({
  product,
  stock,
  reviews,
  reviewsLoading,
  reviewRating,
  reviewComment,
  reviewSubmitting,
  onReviewRatingChange,
  onReviewCommentChange,
  onSubmitReview,
}: ProductDetailTabsSectionProps) {
  const { t: translate } = useTranslation()
  const [activeTab, setActiveTab] = useState<DetailTab>('description')

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : 0

  const tabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: 'description', label: translate('product.detail.tabs.description') },
    {
      id: 'reviews',
      label: translate('product.detail.tabs.reviews'),
      count: product.reviewCount,
    },
  ]

  return (
    <section className="customer-panel overflow-hidden rounded-3xl lg:rounded-4xl">
      <div className="flex gap-1 overflow-x-auto border-b border-slate-100 p-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cx(
              'flex shrink-0 items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all',
              activeTab === tab.id
                ? 'bg-linear-to-r from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/25'
                : 'text-slate-600 hover:bg-slate-50',
            )}
          >
            {tab.label}
            {tab.count != null && tab.count > 0 && (
              <span
                className={cx(
                  'rounded-full px-2 py-0.5 text-[11px] font-bold',
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-8">
        {activeTab === 'description' && (
          <div className="space-y-6">
            <div className="space-y-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              <p>{product.description}</p>
              <p>{translate('product.detail.description.extra')}</p>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                { label: translate('product.detail.description.sku'), value: product.slug },
                {
                  label: translate('product.detail.description.stock'),
                  value: translate('product.detail.description.stockValue', { count: stock }),
                },
                {
                  label: translate('product.detail.description.origin'),
                  value: translate('product.detail.description.originValue'),
                },
                {
                  label: translate('product.detail.tabs.seller'),
                  value: product.sellerName,
                },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-0.5 rounded-2xl bg-slate-50/80 px-4 py-3 ring-1 ring-slate-100"
                >
                  <dt className="text-xs font-medium text-slate-500">{spec.label}</dt>
                  <dd className="text-sm font-semibold text-slate-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {reviews.length > 0 && (
              <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50/50 p-5 ring-1 ring-amber-100/80">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-slate-900">
                    {averageRating.toFixed(1)}
                  </p>
                  <StarRating value={averageRating} size={18} className="mt-1 justify-center" />
                  <p className="mt-1 text-xs text-slate-500">
                    {translate('product.detail.reviews', {
                      count: reviews.length.toLocaleString(),
                    })}
                  </p>
                </div>
              </div>
            )}

            {reviewsLoading ? (
              <div className="flex justify-center py-10">
                <Spin />
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                  <MessageSquare className="size-6" />
                </span>
                <p className="text-sm text-slate-500">
                  {translate('product.detail.reviewsSection.empty')}
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-900">{review.userFullName}</p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <StarRating value={review.rating} size={14} />
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5">
              <h3 className="text-sm font-bold text-slate-900">
                {translate('product.detail.reviewsSection.writeTitle')}
              </h3>

              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-slate-500">
                  {translate('product.detail.reviewsSection.rating')}
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => onReviewRatingChange(rating)}
                      className="rounded-lg p-1 transition-transform hover:scale-110"
                      aria-label={`${rating} ${translate('product.detail.reviewsSection.rating')}`}
                    >
                      <Star
                        className={cx(
                          'size-7',
                          rating <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200',
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                id="review-comment"
                name="comment"
                value={reviewComment}
                onChange={(event) => onReviewCommentChange(event.target.value)}
                placeholder={translate('product.detail.reviewsSection.commentPlaceholder')}
                rows={3}
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
              />

              <Button
                className="mt-4"
                glow
                loading={reviewSubmitting}
                onClick={onSubmitReview}
              >
                {translate('product.detail.reviewsSection.submit')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
