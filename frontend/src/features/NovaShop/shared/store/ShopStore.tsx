import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import cartService from '@/features/NovaShop/customer/cart/services/cartService'
import { ShopContext } from './shopContext'
import type { CartLine, ShopState } from './shopContext'
import { mergeGuestCartToServer } from './mergeGuestCart'
import {
  clearGuestCartStorage,
  loadPersistedShopState,
  savePersistedShopState,
} from './shopStorage'

function mapServerCartItems(
  items: Awaited<ReturnType<typeof cartService.getCart>>['items'],
): CartLine[] {
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    itemId: item.id,
  }))
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { isAuthenticated, user } = useAuth()
  const mergedForUserRef = useRef<string | null>(null)

  const [guestCart, setGuestCart] = useState<CartLine[]>(
    () => loadPersistedShopState().cart ?? [],
  )
  const [wishlist, setWishlist] = useState<string[]>(
    () => loadPersistedShopState().wishlist ?? [],
  )

  const serverCartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  })

  useEffect(() => {
    savePersistedShopState({
      cart: isAuthenticated ? [] : guestCart,
      wishlist,
    })
  }, [guestCart, isAuthenticated, wishlist])

  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (mergedForUserRef.current === user.id) return

    const persistedGuestCart = loadPersistedShopState().cart ?? []
    if (persistedGuestCart.length === 0) {
      mergedForUserRef.current = user.id
      return
    }

    void mergeGuestCartToServer(persistedGuestCart)
      .then(() => {
        setGuestCart([])
        clearGuestCartStorage()
        return queryClient.invalidateQueries({ queryKey: ['cart'] })
      })
      .finally(() => {
        mergedForUserRef.current = user.id
      })
  }, [isAuthenticated, queryClient, user])

  const cart: CartLine[] = isAuthenticated
    ? mapServerCartItems(serverCartQuery.data?.items ?? [])
    : guestCart

  const addToCart = async (productId: string, quantity = 1) => {
    if (isAuthenticated) {
      await cartService.addItem({ productId, quantity })
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      return
    }

    setGuestCart((current) => {
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
  }

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated) {
      const line = cart.find((entry) => entry.productId === productId)
      if (!line?.itemId) return
      await cartService.removeItem(line.itemId)
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      return
    }

    setGuestCart((current) => current.filter((line) => line.productId !== productId))
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    const nextQuantity = Math.max(1, quantity)

    if (isAuthenticated) {
      const line = cart.find((entry) => entry.productId === productId)
      if (!line?.itemId) return
      await cartService.updateItem(line.itemId, { quantity: nextQuantity })
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      return
    }

    setGuestCart((current) =>
      current
        .map((line) =>
          line.productId === productId ? { ...line, quantity: nextQuantity } : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }

  const clearCart = async () => {
    if (isAuthenticated) {
      await cartService.clearAllItems()
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      return
    }

    setGuestCart([])
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((entry) => entry !== productId)
        : [...current, productId],
    )
  }

  const isWished = (productId: string) => wishlist.includes(productId)

  const value: ShopState = {
    cart,
    wishlist,
    isCartLoading: isAuthenticated && serverCartQuery.isLoading,
    isAuthenticated,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isWished,
    cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
    wishlistCount: wishlist.length,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
