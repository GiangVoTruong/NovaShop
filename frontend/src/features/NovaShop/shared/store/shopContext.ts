import { createContext } from 'react'

export interface CartLine {
  productId: string
  quantity: number
  itemId?: string
}

export interface ShopState {
  cart: CartLine[]
  wishlist: string[]
  isCartLoading: boolean
  isAuthenticated: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  toggleWishlist: (productId: string) => void
  isWished: (productId: string) => boolean
  cartCount: number
  wishlistCount: number
}

export const ShopContext = createContext<ShopState | null>(null)
