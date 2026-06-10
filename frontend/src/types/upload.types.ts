export type UploadPurpose = 'PRODUCT_IMAGE' | 'AVATAR' | 'DELIVERY_PROOF'

export type UploadFileResponse = {
  url: string
  fileName: string
  size: number
  mimeType: string
}
