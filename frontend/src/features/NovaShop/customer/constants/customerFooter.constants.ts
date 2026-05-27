import { PATHS } from '@/router/paths'
import { productsPath } from './productList.constants'

export const CUSTOMER_FOOTER_COLS = [
  {
    titleKey: 'footer.columns.shop.title',
    links: [
      { labelKey: 'footer.columns.shop.links.newProducts', to: PATHS.PRODUCTS },
      { labelKey: 'footer.columns.shop.links.promo', to: productsPath({ mode: 'flash-sale' }) },
      { labelKey: 'footer.columns.shop.links.bestseller', to: productsPath({ mode: 'explore' }) },
      { labelKey: 'footer.columns.shop.links.collections', to: productsPath({ mode: 'collections' }) },
    ],
  },
  {
    titleKey: 'footer.columns.support.title',
    links: [
      { labelKey: 'footer.columns.support.links.helpCenter', to: '#' },
      { labelKey: 'footer.columns.support.links.shipping', to: '#' },
      { labelKey: 'footer.columns.support.links.returns', to: '#' },
      { labelKey: 'footer.columns.support.links.warranty', to: '#' },
    ],
  },
  {
    titleKey: 'footer.columns.company.title',
    links: [
      { labelKey: 'footer.columns.company.links.about', to: '#' },
      { labelKey: 'footer.columns.company.links.careers', to: '#' },
      { labelKey: 'footer.columns.company.links.contact', to: '#' },
      { labelKey: 'footer.columns.company.links.policies', to: '#' },
    ],
  },
  {
    titleKey: 'footer.columns.account.title',
    links: [
      { labelKey: 'footer.columns.account.links.login', to: PATHS.LOGIN },
      { labelKey: 'footer.columns.account.links.register', to: PATHS.REGISTER },
      { labelKey: 'footer.columns.account.links.orders', to: PATHS.ORDERS },
      { labelKey: 'footer.columns.account.links.profile', to: PATHS.PROFILE },
    ],
  },
] as const

export const CUSTOMER_SOCIAL_LINKS = [
  { labelKey: 'footer.social.facebook', initial: 'F' },
  { labelKey: 'footer.social.instagram', initial: 'I' },
  { labelKey: 'footer.social.tiktok', initial: 'T' },
  { labelKey: 'footer.social.youtube', initial: 'Y' },
] as const
