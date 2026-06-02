import type { ApiAddressResponse } from '@/types/address.types'

export function formatAddressLine(address: ApiAddressResponse): string {
  const parts = [address.line1, address.ward, address.district, address.city].filter(Boolean)
  return parts.join(', ')
}

export function getAddressLabel(address: ApiAddressResponse): string {
  return address.label?.trim() || address.recipientName
}
