import { getApiErrorMessage } from '@/lib/axios/instances'
import type { TFunction } from 'i18next'

export function getStripePaymentErrorMessage(error: unknown, translate: TFunction): string {
  const message = getApiErrorMessage(error, '')
  if (message.includes('503') || message.toLowerCase().includes('not configured')) {
    return translate('checkout.stripe.notConfigured')
  }
  return getApiErrorMessage(error, translate('checkout.stripe.createFailed'))
}
