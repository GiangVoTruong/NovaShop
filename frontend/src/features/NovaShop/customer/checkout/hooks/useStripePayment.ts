import { useMutation } from '@tanstack/react-query'
import stripeService from '../services/stripeService'

export function useCreateStripePayment() {
  return useMutation({
    mutationKey: ['payments', 'stripe', 'create'],
    mutationFn: (orderId: string) => stripeService.createPayment(orderId),
  })
}

export function redirectToStripe(checkoutUrl: string) {
  window.location.assign(checkoutUrl)
}
