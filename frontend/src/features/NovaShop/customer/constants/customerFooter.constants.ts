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
      { labelKey: 'footer.columns.support.links.helpCenter', to: PATHS.SUPPORT_HELP },
      { labelKey: 'footer.columns.support.links.shipping', to: PATHS.SUPPORT_SHIPPING },
      { labelKey: 'footer.columns.support.links.returns', to: PATHS.SUPPORT_RETURNS },
      { labelKey: 'footer.columns.support.links.warranty', to: PATHS.SUPPORT_WARRANTY },
    ],
  },
  {
    titleKey: 'footer.columns.company.title',
    links: [
      { labelKey: 'footer.columns.company.links.about', to: PATHS.ABOUT },
      { labelKey: 'footer.columns.company.links.careers', to: PATHS.CAREERS },
      { labelKey: 'footer.columns.company.links.contact', to: PATHS.CONTACT },
      { labelKey: 'footer.columns.company.links.policies', to: PATHS.POLICIES },
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
