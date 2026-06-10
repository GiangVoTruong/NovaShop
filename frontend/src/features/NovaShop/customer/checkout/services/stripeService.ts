import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { CreateStripePaymentRequest, CreateStripePaymentResponse } from '@/types/payment.types'
import type { ApiResponse } from '@/types/api.types'

const stripeService = {
  createPayment: async (orderId: string): Promise<CreateStripePaymentResponse> => {
    const body: CreateStripePaymentRequest = { orderId }
    const { data } = await axiosInstance.post<ApiResponse<CreateStripePaymentResponse>>(
      '/payments/stripe/create',
      body,
    )
    return requireApiData(data, 'Failed to create Stripe checkout session')
  },
}

export default stripeService
