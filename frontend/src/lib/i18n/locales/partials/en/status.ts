export const status = {
  order: {
    pending: 'Pending',
    confirmed: 'Confirmed',
    packing: 'Packing',
    shipping: 'Shipping',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  product: {
    active: 'Active',
    draft: 'Draft',
    out_of_stock: 'Out of stock',
  },
  category: {
    electronics: 'Electronics',
    fashion: 'Fashion',
    gaming: 'Gaming',
    office: 'Office',
    home: 'Home',
    beauty: 'Beauty',
  },
  coupon: {
    active: 'Active',
    expired: 'Expired',
    paused: 'Paused',
  },
  customer: {
    active: 'Active',
    inactive: 'Inactive',
    inactiveFull: 'Inactive',
  },
} as const
