export type ApiAddressResponse = {
  id: string
  label: string | null
  recipientName: string
  phone: string
  line1: string
  ward: string | null
  district: string
  city: string
  isDefault: boolean
  createdAt: string
}

export type CreateAddressRequest = {
  label?: string
  recipientName: string
  phone: string
  line1: string
  ward?: string
  district: string
  city: string
  isDefault?: boolean
}

export type UpdateAddressRequest = Partial<CreateAddressRequest>
