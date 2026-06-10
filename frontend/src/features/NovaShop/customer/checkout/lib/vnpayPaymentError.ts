import axios from 'axios'
import type { TFunction } from 'i18next'

import { getApiErrorMessage } from '@/lib/axios/instances'

export function getVnpayPaymentErrorMessage(error: unknown, translate: TFunction): string {
  if (axios.isAxiosError(error) && error.response?.status === 503) {
    return translate('checkout.vnpay.notConfigured')
  }

  return getApiErrorMessage(error, translate('checkout.vnpay.createFailed'))
}
