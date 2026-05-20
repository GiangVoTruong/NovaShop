import type { Order } from '../types'
import { CUSTOMERS } from './customers'
import { PRODUCTS } from './products'

const customer = (idx: number) => CUSTOMERS[idx % CUSTOMERS.length]

function makeOrder(args: {
  id: string
  code: string
  customerIndex: number
  items: { productId: string; qty: number }[]
  status: Order['status']
  payment: string
  address: string
  shipping: number
  tax: number
  createdAt: string
}): Order {
  const cust = customer(args.customerIndex)
  const orderItems = args.items.map((line) => {
    const product = PRODUCTS.find((entry) => entry.id === line.productId)!
    return {
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      quantity: line.qty,
      price: product.price,
    }
  })
  const subtotal = orderItems.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  )
  return {
    id: args.id,
    code: args.code,
    customerId: cust.id,
    customerName: cust.name,
    customerEmail: cust.email,
    customerAvatar: cust.avatar,
    items: orderItems,
    subtotal,
    shipping: args.shipping,
    tax: args.tax,
    total: subtotal + args.shipping + args.tax,
    status: args.status,
    paymentMethod: args.payment,
    shippingAddress: args.address,
    createdAt: args.createdAt,
  }
}

export const ORDERS: Order[] = [
  makeOrder({
    id: 'o-001',
    code: 'NS-2026-00128',
    customerIndex: 0,
    items: [
      { productId: 'p-001', qty: 1 },
      { productId: 'p-019', qty: 2 },
    ],
    status: 'delivered',
    payment: 'Thẻ tín dụng •••• 4242',
    address: '12 Nguyễn Huệ, Quận 1, TP.HCM',
    shipping: 30000,
    tax: 64900,
    createdAt: '2026-05-10T10:24:00',
  }),
  makeOrder({
    id: 'o-002',
    code: 'NS-2026-00129',
    customerIndex: 3,
    items: [{ productId: 'p-007', qty: 1 }],
    status: 'shipping',
    payment: 'Chuyển khoản',
    address: '45 Lê Lợi, Quận Hải Châu, Đà Nẵng',
    shipping: 50000,
    tax: 274500,
    createdAt: '2026-05-12T14:10:00',
  }),
  makeOrder({
    id: 'o-003',
    code: 'NS-2026-00130',
    customerIndex: 1,
    items: [
      { productId: 'p-005', qty: 1 },
      { productId: 'p-006', qty: 1 },
    ],
    status: 'packing',
    payment: 'Ví MoMo',
    address: '8 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    shipping: 30000,
    tax: 189000,
    createdAt: '2026-05-13T09:00:00',
  }),
  makeOrder({
    id: 'o-004',
    code: 'NS-2026-00131',
    customerIndex: 2,
    items: [
      { productId: 'p-013', qty: 2 },
      { productId: 'p-014', qty: 1 },
    ],
    status: 'confirmed',
    payment: 'COD',
    address: '102 Cách Mạng Tháng 8, Quận 3, TP.HCM',
    shipping: 25000,
    tax: 137000,
    createdAt: '2026-05-14T16:40:00',
  }),
  makeOrder({
    id: 'o-005',
    code: 'NS-2026-00132',
    customerIndex: 5,
    items: [{ productId: 'p-016', qty: 1 }],
    status: 'pending',
    payment: 'Chuyển khoản',
    address: '77 Bà Triệu, Hai Bà Trưng, Hà Nội',
    shipping: 0,
    tax: 449500,
    createdAt: '2026-05-15T11:25:00',
  }),
  makeOrder({
    id: 'o-006',
    code: 'NS-2026-00133',
    customerIndex: 4,
    items: [
      { productId: 'p-003', qty: 1 },
      { productId: 'p-010', qty: 1 },
      { productId: 'p-020', qty: 1 },
    ],
    status: 'cancelled',
    payment: 'Thẻ tín dụng •••• 1010',
    address: '15 Phan Đình Phùng, Đà Lạt',
    shipping: 40000,
    tax: 131500,
    createdAt: '2026-05-09T08:30:00',
  }),
  makeOrder({
    id: 'o-007',
    code: 'NS-2026-00134',
    customerIndex: 6,
    items: [{ productId: 'p-002', qty: 1 }],
    status: 'delivered',
    payment: 'Apple Pay',
    address: '199 Hùng Vương, Thủ Đức, TP.HCM',
    shipping: 30000,
    tax: 339500,
    createdAt: '2026-05-08T13:55:00',
  }),
  makeOrder({
    id: 'o-008',
    code: 'NS-2026-00135',
    customerIndex: 7,
    items: [
      { productId: 'p-004', qty: 1 },
      { productId: 'p-011', qty: 1 },
    ],
    status: 'shipping',
    payment: 'Chuyển khoản',
    address: '36 Lý Thường Kiệt, Quận 10, TP.HCM',
    shipping: 30000,
    tax: 334000,
    createdAt: '2026-05-13T15:30:00',
  }),
  makeOrder({
    id: 'o-009',
    code: 'NS-2026-00136',
    customerIndex: 0,
    items: [
      { productId: 'p-008', qty: 2 },
      { productId: 'p-018', qty: 4 },
    ],
    status: 'delivered',
    payment: 'COD',
    address: '12 Nguyễn Huệ, Quận 1, TP.HCM',
    shipping: 25000,
    tax: 127000,
    createdAt: '2026-05-05T17:00:00',
  }),
  makeOrder({
    id: 'o-010',
    code: 'NS-2026-00137',
    customerIndex: 3,
    items: [{ productId: 'p-012', qty: 1 }],
    status: 'pending',
    payment: 'Ví MoMo',
    address: '45 Lê Lợi, Quận Hải Châu, Đà Nẵng',
    shipping: 30000,
    tax: 84500,
    createdAt: '2026-05-16T07:18:00',
  }),
]
