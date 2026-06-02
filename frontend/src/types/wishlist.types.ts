import type { ApiProductResponse } from '@/types/product.types'

export type ApiWishlistItemResponse = {
  id: string
  productId: string
  product: ApiProductResponse
  addedAt: string
}

export type ApiWishlistResponse = {
  items: ApiWishlistItemResponse[]
}

export type WishlistCheckResponse = {
  inWishlist: boolean
}
