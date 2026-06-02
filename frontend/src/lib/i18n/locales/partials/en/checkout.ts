export const checkout = {
  stepLabel: 'Checkout step 2/2',
  title: 'Order',
  titleHighlight: 'checkout',
  backToCart: 'Back to cart',
  empty: {
    title: 'Your cart is empty',
    description: 'Add products to your cart before checkout.',
    shopNow: 'Shop now',
  },
  sections: {
    address: 'Shipping address',
    delivery: 'Delivery method',
    payment: 'Payment method',
  },
  address: {
    empty: 'You have no shipping addresses yet.',
    addLink: 'Add one in Profile',
    default: 'Default',
  },
  coupon: {
    title: 'Coupon code',
    placeholder: 'Enter code',
    apply: 'Apply',
    applied: 'Coupon applied',
    invalid: 'Invalid coupon',
    failed: 'Could not validate coupon',
    discount: 'Discount {{amount}}',
  },
  fields: {
    fullName: 'Full name',
    phone: 'Phone number',
    email: 'Email',
    city: 'Province / City',
    district: 'District',
    address: 'Street address',
    note: 'Order note',
    notePlaceholder: 'Note for the delivery person…',
    cardNumber: 'Card number',
    cardHolder: 'Cardholder name',
    cardExpiry: 'Expiry date',
  },
  cities: {
    hcm: 'Ho Chi Minh City',
    hanoi: 'Hanoi',
    danang: 'Da Nang',
  },
  districts: {
    q1: 'District 1',
    q3: 'District 3',
    q7: 'District 7',
  },
  delivery: {
    standard: {
      title: 'Standard delivery',
      desc: '3–5 business days',
    },
    express: {
      title: '2-hour delivery ⚡',
      desc: 'Inner city HCMC & Hanoi',
    },
    pickup: {
      title: 'Store pickup',
      desc: 'Ready in 30 minutes',
    },
  },
  payment: {
    card: {
      title: 'Credit / debit card',
      desc: 'Visa, Mastercard, JCB',
    },
    momo: {
      title: 'MoMo wallet',
      desc: 'Pay quickly with MoMo',
    },
    bank: {
      title: 'Bank transfer',
      desc: 'Internet banking / QR code',
    },
    cod: {
      title: 'Cash on delivery',
      desc: 'Pay when you receive the order',
    },
    vnpay: {
      title: 'VNPAY',
      desc: 'Pay via VNPAY gateway',
    },
    stripe: {
      title: 'Stripe',
      desc: 'International cards via Stripe',
    },
  },
  order: {
    title: 'Your order',
    subtotal: 'Subtotal',
    discount: 'Discount',
    shipping: 'Shipping',
    tax: 'Tax (5%)',
    total: 'Total',
    free: 'Free',
    placeOrder: 'Place order',
    termsPrefix: 'By placing an order you agree to NovaShop',
    terms: 'Terms',
    termsSuffix: '',
  },
  messages: {
    success: '🎉 Order placed successfully!',
    failed: 'Could not place order. Please try again.',
    noAddress: 'Please select a shipping address',
  },
} as const
