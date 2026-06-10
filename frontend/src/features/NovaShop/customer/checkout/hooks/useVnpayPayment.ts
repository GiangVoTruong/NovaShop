import { useMutation } from '@tanstack/react-query'
import vnpayService from '../services/vnpayService'

export function useCreateVnpayPayment() {
  return useMutation({
    mutationKey: ['payments', 'vnpay', 'create'],
    mutationFn: (orderId: string) => vnpayService.createPayment(orderId),
  })
}

export function redirectToVnpay(paymentUrl: string) {
  window.location.assign(paymentUrl)
}
