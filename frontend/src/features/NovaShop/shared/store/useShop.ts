import { useContext } from 'react'
import { ShopContext } from './shopContext'
import type { ShopState } from './shopContext'

export function useShop(): ShopState {
  const ctx = useContext(ShopContext)
  if (!ctx) {
    throw new Error('useShop must be used inside <ShopProvider>')
  }
  return ctx
}
