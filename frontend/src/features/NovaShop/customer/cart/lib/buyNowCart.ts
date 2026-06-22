import type { AddCartItemRequest, ApiCartResponse } from '@/types/cart.types'
import cartService from '../services/cartService'

export type CartItemSnapshot = AddCartItemRequest

export type BuyNowSession = {
  productId: string
  quantity: number
}

const BUY_NOW_SESSION_KEY = 'novashop.buyNow.session'
const BUY_NOW_CART_SNAPSHOT_KEY = 'novashop.buyNow.cartSnapshot'
const BUY_NOW_CHECKOUT_FLAG = 'novashop.buyNow.active'

function readSnapshot(): CartItemSnapshot[] {
  const raw = sessionStorage.getItem(BUY_NOW_CART_SNAPSHOT_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(
      (entry): entry is CartItemSnapshot =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as CartItemSnapshot).productId === 'string' &&
        typeof (entry as CartItemSnapshot).quantity === 'number',
    )
  } catch (error) {
    console.error('[buyNowCart] Failed to parse snapshot:', error)
    return []
  }
}

export function readBuyNowSession(): BuyNowSession | null {
  const raw = sessionStorage.getItem(BUY_NOW_SESSION_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as BuyNowSession).productId !== 'string' ||
      typeof (parsed as BuyNowSession).quantity !== 'number'
    ) {
      return null
    }
    return parsed as BuyNowSession
  } catch (error) {
    console.error('[buyNowCart] Failed to parse session:', error)
    return null
  }
}

export function isBuyNowCheckoutActive(): boolean {
  return sessionStorage.getItem(BUY_NOW_CHECKOUT_FLAG) === '1'
}

function saveSnapshot(items: CartItemSnapshot[]) {
  sessionStorage.setItem(BUY_NOW_CART_SNAPSHOT_KEY, JSON.stringify(items))
}

export function startBuyNowSession(
  productId: string,
  quantity: number,
  currentCart: ApiCartResponse | undefined,
) {
  const snapshot: CartItemSnapshot[] = (currentCart?.items ?? []).map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }))

  sessionStorage.setItem(
    BUY_NOW_SESSION_KEY,
    JSON.stringify({ productId, quantity } satisfies BuyNowSession),
  )
  saveSnapshot(snapshot)
  sessionStorage.setItem(BUY_NOW_CHECKOUT_FLAG, '1')
  sessionStorage.removeItem('novashop.partialCheckout.session')
  sessionStorage.removeItem('novashop.partialCheckout.snapshot')
}

export function clearBuyNowSession() {
  sessionStorage.removeItem(BUY_NOW_SESSION_KEY)
  sessionStorage.removeItem(BUY_NOW_CART_SNAPSHOT_KEY)
  sessionStorage.removeItem(BUY_NOW_CHECKOUT_FLAG)
}

/** Chỉ gọi ngay trước POST /orders/checkout — BE vẫn đọc giỏ server. */
export async function syncBuyNowCartForCheckout(): Promise<void> {
  const session = readBuyNowSession()
  if (!session) {
    throw new Error('Buy now session not found')
  }

  await cartService.clearAllItems()
  await cartService.addItem({ productId: session.productId, quantity: session.quantity })
}

export async function restoreBuyNowCartSnapshot(): Promise<ApiCartResponse> {
  const snapshot = readSnapshot()

  await cartService.clearAllItems()

  for (const item of snapshot) {
    await cartService.addItem(item)
  }

  return cartService.getCart()
}

export async function finalizeBuyNowAfterCheckout(
  queryClient: { setQueryData: (key: readonly string[], data: ApiCartResponse) => void },
  cartQueryKey: readonly string[],
): Promise<void> {
  const restoredCart = await restoreBuyNowCartSnapshot()
  clearBuyNowSession()
  queryClient.setQueryData(cartQueryKey, restoredCart)
}

export async function rollbackBuyNowCartSync(
  queryClient: { setQueryData: (key: readonly string[], data: ApiCartResponse) => void },
  cartQueryKey: readonly string[],
): Promise<void> {
  const restoredCart = await restoreBuyNowCartSnapshot()
  clearBuyNowSession()
  queryClient.setQueryData(cartQueryKey, restoredCart)
}

/** Restore cart snapshot left after checkout succeeded but finalize failed. */
export async function recoverOrphanedBuyNowCart(
  queryClient: { setQueryData: (key: readonly string[], data: ApiCartResponse) => void },
  cartQueryKey: readonly string[],
): Promise<ApiCartResponse | null> {
  if (!readBuyNowSession()) {
    return null
  }

  const restoredCart = await restoreBuyNowCartSnapshot()
  clearBuyNowSession()
  queryClient.setQueryData(cartQueryKey, restoredCart)
  return restoredCart
}
