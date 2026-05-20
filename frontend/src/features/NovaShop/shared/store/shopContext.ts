import { createContext } from 'react'

export interface CartLine {
  productId: string
  quantity: number
}

export interface ShopState {
  cart: CartLine[]
  wishlist: string[]
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => void
  isWished: (productId: string) => boolean
  cartCount: number
  wishlistCount: number
}

export const ShopContext = createContext<ShopState | null>(null)
