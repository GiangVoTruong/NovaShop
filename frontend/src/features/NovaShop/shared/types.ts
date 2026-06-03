export type CategorySlug =
  | 'electronics'
  | 'fashion'
  | 'gaming'
  | 'office'
  | 'home'
  | 'beauty'

export interface Category {
  id: string
  name: string
  slug: CategorySlug
  productCount: number
  image: string
  description: string
}

export interface Product {
  id: string
  name: string
  slug: string
  brand: string
  category: CategorySlug
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  stock: number
  sku: string
  status: 'active' | 'draft' | 'out_of_stock'
  images: string[]
  description: string
  colors?: string[]
  sizes?: string[]
  tags?: string[]
  createdAt: string
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packing'
  | 'shipping'
  | 'delivered_pending_receiver_confirm'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  code: string
  customerId: string
  customerName: string
  customerEmail: string
  customerAvatar: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: string
  shippingAddress: string
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  totalOrders: number
  totalSpent: number
  joinedAt: string
  status: 'active' | 'inactive'
}

export interface Coupon {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  minOrder: number
  expiresAt: string
  used: number
  limit: number
  status: 'active' | 'expired' | 'paused'
}

export interface AnalyticsPoint {
  month: string
  revenue: number
  orders: number
  visitors: number
}

export interface CartLineItem {
  productId: string
  quantity: number
  color?: string
  size?: string
}
