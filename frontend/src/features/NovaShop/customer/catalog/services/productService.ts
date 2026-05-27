import { axiosInstance } from '@/lib/axios/instances'
import type {
  ApiProductResponse,
  ApiResponse,
  ProductListParams,
  ProductsPageResult,
} from '@/types/product.types'
import { buildProductListQuery } from '../lib/buildProductListQuery'

function toProductsPageResult(response: ApiResponse<ApiProductResponse[]>): ProductsPageResult {
  return {
    data: response.data ?? [],
    total: response.meta?.total ?? 0,
    page: response.meta?.page ?? 1,
    limit: response.meta?.limit ?? 20,
  }
}

const productService = {
  listProducts: async (params: ProductListParams = {}): Promise<ProductsPageResult> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiProductResponse[]>>('/products', {
      params: buildProductListQuery(params),
    })
    return toProductsPageResult(data)
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
