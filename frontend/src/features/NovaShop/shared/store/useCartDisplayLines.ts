import { useQueries, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import cartService from '@/features/NovaShop/customer/cart/services/cartService'
import productService from '@/features/NovaShop/customer/catalog/services/productService'
import {
  getProductImages,
  getProductSalePrice,
  PRODUCT_PLACEHOLDER_IMAGE,
  toProductNumber,
} from '@/features/NovaShop/customer/catalog/lib/productApi'
import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { useShop } from './useShop'

export type CartDisplayLine = {
  productId: string
  itemId?: string
  name: string
  image: string
  unitPrice: number
  quantity: number
  stock: number
}

function toNumber(value: number | string): number {
  return toProductNumber(value)
}

export function useCartDisplayLines() {
  const { cart, isAuthenticated, isCartLoading } = useShop()
  const { isBootstrapping } = useAuth()

  const serverCartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  })

  const guestProductQueries = useQueries({
    queries: cart.map((line) => ({
      queryKey: ['product', line.productId],
      queryFn: () => productService.getById(line.productId),
      enabled: !isAuthenticated && Boolean(line.productId),
      staleTime: 60_000,
    })),
  })

  const lines = useMemo<CartDisplayLine[]>(() => {
    if (isAuthenticated) {
      return (serverCartQuery.data?.items ?? []).map((item) => ({
        productId: item.productId,
        itemId: item.id,
        name: item.productName,
        image:
          item.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE,
        unitPrice: toNumber(item.unitPrice),
        quantity: item.quantity,
        stock: item.availableStock,
      }))
    }

    return cart.flatMap((line, index) => {
      const productResponse = guestProductQueries[index]?.data
      if (!productResponse) return []

      return [
        {
          productId: line.productId,
          name: productResponse.name,
          image: getProductImages(productResponse)[0] ?? '',
          unitPrice: getProductSalePrice(productResponse),
          quantity: line.quantity,
          stock: productResponse.stock ?? 0,
        },
      ]
    })
  }, [cart, guestProductQueries, isAuthenticated, serverCartQuery.data?.items])

  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  )

  const isGuestLoading =
    !isAuthenticated &&
    cart.length > 0 &&
    guestProductQueries.some((query) => query.isLoading)

  return {
    lines,
    subtotal,
    isLoading: isBootstrapping || isCartLoading || isGuestLoading,
  }
}
