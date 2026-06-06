import { axiosInstance } from '@/lib/axios/instances'
import type { ApiResponse } from '@/types/api.types'
import type { ApiCategoryResponse } from '@/types/product.types'

const categoryService = {
  listCategories: async (): Promise<ApiCategoryResponse[]> => {
    const { data } = await axiosInstance.get<ApiResponse<ApiCategoryResponse[]>>('/categories')
    return data.data ?? []
  },
}

export default categoryService
