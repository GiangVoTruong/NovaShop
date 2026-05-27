export type ApiCartItemResponse = {
  id: string
  productId: string
  productName: string
  productSlug: string
  imageUrl: string | null
  unitPrice: number
  quantity: number
  subtotal: number
  availableStock: number
}

export type ApiCartResponse = {
  id: string
  items: ApiCartItemResponse[]
  totalAmount: number
  itemCount: number
}

export type AddCartItemRequest = {
  productId: string
  quantity: number
}

export type UpdateCartItemRequest = {
  quantity: number
}
