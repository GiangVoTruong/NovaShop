import { toPageResult } from '@/lib/api/toPageResult'
import { axiosInstance } from '@/lib/axios/instances'
import type { ApiResponse, PageResult } from '@/types/api.types'
import type { ApiProductResponse, ProductListParams } from '@/types/product.types'
import { buildProductListQuery } from '../lib/buildProductListQuery'

const productService = {
  listProducts: async (params: ProductListParams = {}): Promise<PageResult<ApiProductResponse>> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiProductResponse[]>>('/products', {
      params: buildProductListQuery(params),
    })
    return toPageResult(data)
  },

  getById: async (productId: string): Promise<ApiProductResponse> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiProductResponse>>(
      `/products/${productId}`,
    )
    return data.data
  },

  getBySlug: async (slug: string): Promise<ApiProductResponse> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiProductResponse>>(
      `/products/slug/${slug}`,
    )
    return data.data
  },
}

export default productService
