const CHECKOUT_COUPON_STORAGE_KEY = 'novashop.checkout.couponCode'

export function readStoredCouponCode(): string {
  return sessionStorage.getItem(CHECKOUT_COUPON_STORAGE_KEY)?.trim() ?? ''
}

export function writeStoredCouponCode(code: string) {
  sessionStorage.setItem(CHECKOUT_COUPON_STORAGE_KEY, code.trim().toUpperCase())
}

export function clearStoredCouponCode() {
  sessionStorage.removeItem(CHECKOUT_COUPON_STORAGE_KEY)
}
