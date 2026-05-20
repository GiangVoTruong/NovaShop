import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ShopContext } from './shopContext'
import type { CartLine, ShopState } from './shopContext'

const STORAGE_KEY = 'novashop:state:v1'

interface PersistedState {
  cart?: CartLine[]
  wishlist?: string[]
}

function loadFromStorage(): PersistedState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PersistedState
  } catch (error) {
    console.warn('[ShopStore] failed to load state:', error)
    return {}
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => loadFromStorage().cart ?? [])
  const [wishlist, setWishlist] = useState<string[]>(
    () => loadFromStorage().wishlist ?? [],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cart, wishlist }),
      )
    } catch (error) {
      console.warn('[ShopStore] failed to save state:', error)
    }
  }, [cart, wishlist])

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((line) => line.productId === productId)
      if (existing) {
        return current.map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        )
      }
      return [...current, { productId, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => current.filter((line) => line.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.max(1, quantity) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((entry) => entry !== productId)
        : [...current, productId],
    )
  }, [])

  const isWished = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  )

  const value = useMemo<ShopState>(
    () => ({
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isWished,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      wishlistCount: wishlist.length,
    }),
    [
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isWished,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
