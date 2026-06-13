export type ApiReviewResponse = {
  id: string
  userId: string
  userFullName: string
  productId: string
  rating: number
  comment: string | null
  status?: 'VISIBLE' | 'HIDDEN'
  createdAt: string
  replyComment?: string | null
  replyUserFullName?: string | null
  replyCreatedAt?: string | null
}

export type CreateReviewRequest = {
  rating: number
  comment?: string
}

export const MAX_REVIEWS_PER_PRODUCT = 3
