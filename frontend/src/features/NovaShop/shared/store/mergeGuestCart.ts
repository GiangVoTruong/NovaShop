import cartService from '@/features/NovaShop/customer/cart/services/cartService'
import type { CartLine } from './shopContext'

export async function mergeGuestCartToServer(guestCart: CartLine[]): Promise<void> {
  for (const line of guestCart) {
    await cartService.addItem({
      productId: line.productId,
      quantity: line.quantity,
    })
  }
}
