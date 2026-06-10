import { useMutation } from '@tanstack/react-query'
import uploadService from '../services/uploadService'
import type { UploadPurpose } from '@/types/upload.types'

export function useUploadFile() {
  return useMutation({
    mutationKey: ['uploads'],
    mutationFn: ({ file, purpose }: { file: File; purpose: UploadPurpose }) =>
      uploadService.upload(file, purpose),
  })
}
