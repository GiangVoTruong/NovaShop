import axios from 'axios'

import type { ApiErrorBody } from '@/types/api.types'

export function isEmailNotVerifiedError(error: unknown): boolean {
  if (!axios.isAxiosError(error) || error.response?.status !== 403) {
    return false
  }

  const message = (error.response.data as ApiErrorBody | undefined)?.message ?? ''
  return message.startsWith('Email not verified')
}
