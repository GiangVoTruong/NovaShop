import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { UploadFileResponse, UploadPurpose } from '@/types/upload.types'
import type { ApiResponse } from '@/types/api.types'

const uploadService = {
  upload: async (file: File, purpose: UploadPurpose): Promise<UploadFileResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('purpose', purpose)

    const { data } = await axiosInstance.post<ApiResponse<UploadFileResponse>>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return requireApiData(data, 'Upload failed')
  },
}

export default uploadService
