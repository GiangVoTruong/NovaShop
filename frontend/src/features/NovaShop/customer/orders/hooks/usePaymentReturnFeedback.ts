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

export function usePaymentReturnFeedback(onHandled?: () => void): PaymentReturnState {
  const [searchParams, setSearchParams] = useSearchParams()
  const [result, setResult] = useState<PaymentReturnState>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    if (processedRef.current) {
      return
    }

    const providers: PaymentProvider[] = ['vnpay', 'stripe']
    for (const provider of providers) {
      const feedback = parsePaymentReturnFeedback(provider, searchParams.get(provider))
      if (!feedback) {
        continue
      }

      processedRef.current = true
      setResult({ provider, feedback })
      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams)
          nextParams.delete(provider)
          nextParams.delete('vnp_ResponseCode')
          nextParams.delete('orderId')
          return nextParams
        },
        { replace: true },
      )
      onHandled?.()
      break
    }
  }, [onHandled, searchParams, setSearchParams])

  return result
}

/** @deprecated Use usePaymentReturnFeedback */
export function useVnpayReturnFeedback(onHandled?: () => void) {
  const result = usePaymentReturnFeedback(onHandled)
  return result?.provider === 'vnpay' ? result.feedback : null
}
