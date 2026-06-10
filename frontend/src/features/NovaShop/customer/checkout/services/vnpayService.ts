import { requireApiData } from '@/lib/api/requireApiData'
import { axiosInstance } from '@/lib/axios/instances'
import type { CreateVnpayPaymentRequest, CreateVnpayPaymentResponse } from '@/types/payment.types'
import type { ApiResponse } from '@/types/api.types'

const vnpayService = {
  createPayment: async (orderId: string): Promise<CreateVnpayPaymentResponse> => {
    const body: CreateVnpayPaymentRequest = { orderId }
    const { data } = await axiosInstance.post<ApiResponse<CreateVnpayPaymentResponse>>(
      '/payments/vnpay/create',
      body,
    )
    return requireApiData(data, 'Failed to create VNPay payment URL')
  },
}

export default vnpayService
