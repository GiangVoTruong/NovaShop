import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateAddressRequest, UpdateAddressRequest } from '@/types/address.types'
import addressService from '../services/addressService'

export const ADDRESSES_QUERY_KEY = ['addresses'] as const

export function useAddresses() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: addressService.getMyAddresses,
    enabled: isAuthenticated,
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['addresses', 'create'],
    mutationFn: (request: CreateAddressRequest) => addressService.createAddress(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY })
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['addresses', 'update'],
    mutationFn: ({
      addressId,
      request,
    }: {
      addressId: string
      request: UpdateAddressRequest
    }) => addressService.updateAddress(addressId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['addresses', 'delete'],
    mutationFn: (addressId: string) => addressService.deleteAddress(addressId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY })
    },
  })
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['addresses', 'default'],
    mutationFn: (addressId: string) => addressService.setDefaultAddress(addressId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY })
    },
  })
}
