export type ApiReviewResponse = {
  id: string
  userId: string
  userFullName: string
  productId: string
  rating: number
  comment: string | null
  createdAt: string
}

export type CreateReviewRequest = {
  rating: number
  comment?: string
}
