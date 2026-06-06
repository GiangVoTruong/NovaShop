import type { ListQueryParams } from '@/types/api.types'
import type {
  ApiOrderItemResponse,
  ApiOrderShippingAddress,
  ApiOrderStatus,
  ApiPaymentMethod,
  ApiPaymentStatus,
} from '@/types/order.types'

export type AdminOrderResponse = {
  id: string
  userId: string
  customerFullName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  finalAmount: number
  status: ApiOrderStatus
  paymentMethod: ApiPaymentMethod
  paymentStatus: ApiPaymentStatus
  shippingAddress?: ApiOrderShippingAddress | null
  note?: string | null
  itemCount: number
  items: ApiOrderItemResponse[]
  createdAt: string
  updatedAt: string
}

export type AdminOrdersListParams = ListQueryParams & {
  sortDir?: 'asc' | 'desc'
  status?: ApiOrderStatus
  keyword?: string
  fromDate?: string
  toDate?: string
}

export type AdminAnalyticsOverview = {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueByMonth: Array<{ month: string; revenue: number }>
  ordersByStatus: Array<{ status: ApiOrderStatus; count: number }>
  topProducts: Array<{
    productId: string
    name: string
    soldCount: number
    revenue: number
  }>
}

export type ShopSettings = {
  shopName: string
  supportEmail: string
  supportPhone: string
  shippingFeeDefault: number
  freeShippingThreshold: number
  taxRate: number
  maintenanceMode: boolean
}

export type AdminCoupon = {
  id: string
  code: string
  type: 'PERCENT' | 'FIXED'
  value: number
  minOrderAmount: number | null
  maxDiscount: number | null
  startAt: string | null
  endAt: string | null
  usageLimit: number
  usedCount: number
  active: boolean
}

export type CreateAdminCouponRequest = {
  code: string
  type: 'PERCENT' | 'FIXED'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  startAt?: string
  endAt?: string
  usageLimit: number
  active?: boolean
}

export type UpdateAdminCouponRequest = Partial<Omit<CreateAdminCouponRequest, 'code'>>

export type AdminUser = {
  id: string
  email: string
  fullName: string
  phone: string
  avatarUrl: string | null
  role: 'ADMIN' | 'CUSTOMER' | 'SELLER'
  isActive: boolean
  createdAt: string
}

export type UpdateOrderStatusRequest = {
  status: ApiOrderStatus
}
