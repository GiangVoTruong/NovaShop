import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type {
  ApiAddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '@/types/address.types'
import type { ApiResponse } from '@/types/api.types'

const addressService = {
  getMyAddresses: async (): Promise<ApiAddressResponse[]> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiAddressResponse[]>>(
      '/users/me/addresses',
    )
    return requireApiData(data, 'Failed to load addresses') ?? []
  },

  createAddress: async (request: CreateAddressRequest): Promise<ApiAddressResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<ApiAddressResponse>>(
      '/users/me/addresses',
      request,
    )
    return requireApiData(data, 'Failed to create address')
  },

  updateAddress: async (
    addressId: string,
    request: UpdateAddressRequest,
  ): Promise<ApiAddressResponse> => {
    const { data } = await axiosInstance.put<ApiResponse<ApiAddressResponse>>(
      `/users/me/addresses/${addressId}`,
      request,
    )
    return requireApiData(data, 'Failed to update address')
  },

  deleteAddress: async (addressId: string): Promise<void> => {
    await axiosInstance.delete(`/users/me/addresses/${addressId}`)
  },

  setDefaultAddress: async (addressId: string): Promise<ApiAddressResponse> => {
    const { data } = await axiosInstance.patch<ApiResponse<ApiAddressResponse>>(
      `/users/me/addresses/${addressId}/default`,
    )
    return requireApiData(data, 'Failed to set default address')
  },
}

export default addressService
