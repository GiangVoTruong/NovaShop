import type { ApiCartItemResponse, ApiCartResponse } from '@/types/cart.types'
import cartService from '../services/cartService'

export type PartialCheckoutLineItem = {
  cartItemId: string
  productId: string
  productName: string
  imageUrl: string | null
  unitPrice: number
  quantity: number
  subtotal: number
}

type CartLineSnapshot = {
  cartItemId: string
  productId: string
  quantity: number
}

type PartialCheckoutSession = {
  selectedCartItemIds: string[]
  selectedItems: PartialCheckoutLineItem[]
}

const SESSION_KEY = 'novashop.partialCheckout.session'
const SNAPSHOT_KEY = 'novashop.partialCheckout.snapshot'
const BUY_NOW_SESSION_KEY = 'novashop.buyNow.session'
const BUY_NOW_SNAPSHOT_KEY = 'novashop.buyNow.cartSnapshot'
const BUY_NOW_FLAG_KEY = 'novashop.buyNow.active'

function toAmount(value: number | string): number {
  return typeof value === 'number' ? value : Number(value)
}

function toLineItem(item: ApiCartItemResponse): PartialCheckoutLineItem {
  return {
    cartItemId: item.id,
    productId: item.productId,
    productName: item.productName,
    imageUrl: item.imageUrl,
    unitPrice: toAmount(item.unitPrice),
    quantity: item.quantity,
    subtotal: toAmount(item.subtotal),
  }
}

function readSnapshot(): CartLineSnapshot[] {
  const raw = sessionStorage.getItem(SNAPSHOT_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(
      (entry): entry is CartLineSnapshot =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as CartLineSnapshot).cartItemId === 'string' &&
        typeof (entry as CartLineSnapshot).productId === 'string' &&
        typeof (entry as CartLineSnapshot).quantity === 'number',
    )
  } catch (error) {
    console.error('[partialCheckoutSession] Failed to parse snapshot:', error)
    return []
  }
}

export function readPartialCheckoutSession(): PartialCheckoutSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !Array.isArray((parsed as PartialCheckoutSession).selectedCartItemIds) ||
      !Array.isArray((parsed as PartialCheckoutSession).selectedItems)
    ) {
      return null
    }
    return parsed as PartialCheckoutSession
  } catch (error) {
    console.error('[partialCheckoutSession] Failed to parse session:', error)
    return null
  }
}

function clearBuyNowSessionStorage() {
  sessionStorage.removeItem(BUY_NOW_SESSION_KEY)
  sessionStorage.removeItem(BUY_NOW_SNAPSHOT_KEY)
  sessionStorage.removeItem(BUY_NOW_FLAG_KEY)
}

export function clearPartialCheckoutSession() {
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SNAPSHOT_KEY)
}

export function startPartialCheckoutSession(
  selectedItems: ApiCartItemResponse[],
  currentCart: ApiCartResponse,
) {
  clearBuyNowSessionStorage()

  const snapshot: CartLineSnapshot[] = currentCart.items.map((item) => ({
    cartItemId: item.id,
    productId: item.productId,
    quantity: item.quantity,
  }))

  const session: PartialCheckoutSession = {
    selectedCartItemIds: selectedItems.map((item) => item.id),
    selectedItems: selectedItems.map(toLineItem),
  }

  sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot))
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export async function syncPartialCheckoutForCheckout(): Promise<void> {
  const session = readPartialCheckoutSession()
  if (!session) {
    throw new Error('Partial checkout session not found')
  }

  await cartService.clearAllItems()

  for (const item of session.selectedItems) {
    await cartService.addItem({ productId: item.productId, quantity: item.quantity })
  }
}

async function restoreFullCartSnapshot(): Promise<ApiCartResponse> {
  const snapshot = readSnapshot()

  await cartService.clearAllItems()

  for (const item of snapshot) {
    await cartService.addItem({ productId: item.productId, quantity: item.quantity })
  }

  return cartService.getCart()
}

async function restoreUnselectedCartItems(): Promise<ApiCartResponse> {
  const snapshot = readSnapshot()
  const session = readPartialCheckoutSession()
  const selectedIds = new Set(session?.selectedCartItemIds ?? [])

  await cartService.clearAllItems()

  for (const item of snapshot) {
    if (!selectedIds.has(item.cartItemId)) {
      await cartService.addItem({ productId: item.productId, quantity: item.quantity })
    }
  }

  return cartService.getCart()
}

export async function finalizePartialCheckoutAfterCheckout(
  queryClient: { setQueryData: (key: readonly string[], data: ApiCartResponse) => void },
  cartQueryKey: readonly string[],
): Promise<void> {
  const restoredCart = await restoreUnselectedCartItems()
  clearPartialCheckoutSession()
  queryClient.setQueryData(cartQueryKey, restoredCart)
}

export async function rollbackPartialCheckoutSync(
  queryClient: { setQueryData: (key: readonly string[], data: ApiCartResponse) => void },
  cartQueryKey: readonly string[],
): Promise<void> {
  const restoredCart = await restoreFullCartSnapshot()
  clearPartialCheckoutSession()
  queryClient.setQueryData(cartQueryKey, restoredCart)
}

/** Restore unselected items left after checkout succeeded but finalize failed. */
export async function recoverOrphanedPartialCheckoutCart(
  queryClient: { setQueryData: (key: readonly string[], data: ApiCartResponse) => void },
  cartQueryKey: readonly string[],
): Promise<ApiCartResponse | null> {
  if (!readPartialCheckoutSession()) {
    return null
  }

  const restoredCart = await restoreUnselectedCartItems()
  clearPartialCheckoutSession()
  queryClient.setQueryData(cartQueryKey, restoredCart)
  return restoredCart
}
