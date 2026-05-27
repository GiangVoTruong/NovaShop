import type { CartLine } from './shopContext'

export interface PersistedState {
  cart?: CartLine[]
  wishlist?: string[]
}

export const SHOP_STORAGE_KEY = 'novashop:state:v1'

export function loadPersistedShopState(): PersistedState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(SHOP_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PersistedState
  } catch (error) {
    console.warn('[ShopStore] failed to load state:', error)
    return {}
  }
}

export function savePersistedShopState(state: PersistedState): void {
  try {
    window.localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('[ShopStore] failed to save state:', error)
  }
}

export function clearGuestCartStorage(): void {
  const current = loadPersistedShopState()
  savePersistedShopState({ ...current, cart: [] })
}
