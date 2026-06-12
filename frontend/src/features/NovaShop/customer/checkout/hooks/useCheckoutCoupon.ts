import type { ValidateCouponResponse } from '@/types/coupon.types'
import { message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  clearStoredCouponCode,
  readStoredCouponCode,
  writeStoredCouponCode,
} from '../lib/checkoutCouponStorage'
import { useValidateCoupon } from './useCoupon'

function toAmount(value: number | string): number {
  return typeof value === 'number' ? value : Number(value)
}

export function useCheckoutCoupon(cartTotal: number) {
  const { t: translate } = useTranslation()
  const validateMutation = useValidateCoupon()
  const [couponCode, setCouponCodeState] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const restoredRef = useRef(false)
  const previousCartTotalRef = useRef<number | null>(null)

  const setCouponCode = (value: string) => {
    setCouponCodeState(value.toUpperCase())
    setAppliedCoupon(null)
  }

  const applyValidationResult = (
    response: ValidateCouponResponse,
    trimmedCode: string,
    showFeedback: boolean,
  ) => {
    if (!response.valid) {
      setAppliedCoupon(null)
      clearStoredCouponCode()
      if (showFeedback) {
        message.warning(response.message || translate('checkout.coupon.invalid'))
      }
      return
    }

    setAppliedCoupon(response)
    writeStoredCouponCode(trimmedCode)
    if (showFeedback) {
      message.success(translate('checkout.coupon.applied'))
    }
  }

  const validateSilently = (trimmedCode: string) => {
    if (!trimmedCode || cartTotal <= 0) {
      return
    }

    validateMutation.mutate(
      { code: trimmedCode, cartTotal },
      {
        onSuccess: (response) => {
          if (response.valid) {
            setAppliedCoupon(response)
            writeStoredCouponCode(trimmedCode)
            return
          }
          setAppliedCoupon(null)
          clearStoredCouponCode()
        },
      },
    )
  }

  const handleApplyCoupon = () => {
    const trimmedCode = couponCode.trim()
    if (!trimmedCode || cartTotal <= 0 || isApplying) {
      return
    }

    setIsApplying(true)
    validateMutation.mutate(
      { code: trimmedCode, cartTotal },
      {
        onSuccess: (response) => applyValidationResult(response, trimmedCode, true),
        onError: () => message.error(translate('checkout.coupon.failed')),
        onSettled: () => setIsApplying(false),
      },
    )
  }

  useEffect(() => {
    if (restoredRef.current || cartTotal <= 0) {
      return
    }

    restoredRef.current = true
    const storedCode = readStoredCouponCode()
    if (!storedCode) {
      return
    }

    setCouponCodeState(storedCode)
    validateSilently(storedCode)
  }, [cartTotal])

  useEffect(() => {
    if (cartTotal <= 0) {
      previousCartTotalRef.current = null
      return
    }

    const previousTotal = previousCartTotalRef.current
    previousCartTotalRef.current = cartTotal

    if (previousTotal === null || previousTotal === cartTotal) {
      return
    }

    const trimmedCode = couponCode.trim()
    if (!trimmedCode || !appliedCoupon?.valid) {
      return
    }

    validateSilently(trimmedCode)
  }, [cartTotal])

  const discountAmount = appliedCoupon?.valid ? toAmount(appliedCoupon.discountAmount) : 0
  const finalAmount = Math.max(0, cartTotal - discountAmount)

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    discountAmount,
    finalAmount,
    handleApplyCoupon,
    isValidatingCoupon: isApplying,
  }
}
