import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  parsePaymentReturnFeedback,
  type PaymentProvider,
  type PaymentReturnFeedback,
} from '../lib/paymentReturn'

export type PaymentReturnState = {
  provider: PaymentProvider
  feedback: Exclude<PaymentReturnFeedback, null>
} | null

const PAYMENT_PROVIDERS: PaymentProvider[] = ['vnpay', 'stripe']

function parsePaymentReturnFromParams(
  searchParams: URLSearchParams,
): PaymentReturnState {
  for (const provider of PAYMENT_PROVIDERS) {
    const feedback = parsePaymentReturnFeedback(provider, searchParams.get(provider))
    if (feedback) {
      return { provider, feedback }
    }
  }
  return null
}

export function usePaymentReturnFeedback(onHandled?: () => void): PaymentReturnState {
  const [searchParams, setSearchParams] = useSearchParams()
  const [persistedFeedback, setPersistedFeedback] = useState<PaymentReturnState>(null)
  const handledKeyRef = useRef<string | null>(null)

  const parsedFeedback = parsePaymentReturnFromParams(searchParams)

  useEffect(() => {
    if (!parsedFeedback) {
      return
    }

    const handleKey = `${parsedFeedback.provider}:${parsedFeedback.feedback}:${searchParams.toString()}`
    if (handledKeyRef.current === handleKey) {
      return
    }

    handledKeyRef.current = handleKey
    queueMicrotask(() => {
      setPersistedFeedback(parsedFeedback)
    })
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams)
        nextParams.delete(parsedFeedback.provider)
        nextParams.delete('vnp_ResponseCode')
        nextParams.delete('orderId')
        return nextParams
      },
      { replace: true },
    )
    onHandled?.()
  }, [onHandled, parsedFeedback, searchParams, setSearchParams])

  return persistedFeedback ?? parsedFeedback
}

/** @deprecated Use usePaymentReturnFeedback */
export function useVnpayReturnFeedback(onHandled?: () => void) {
  const result = usePaymentReturnFeedback(onHandled)
  return result?.provider === 'vnpay' ? result.feedback : null
}
