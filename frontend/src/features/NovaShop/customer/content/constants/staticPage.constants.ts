import { PATHS } from '@/router/paths'

export const STATIC_PAGE_KEYS = [
  'helpCenter',
  'shipping',
  'returns',
  'warranty',
  'about',
  'careers',
  'contact',
  'policies',
  'terms',
  'privacy',
  'cookies',
] as const

export type StaticPageKey = (typeof STATIC_PAGE_KEYS)[number]

export const STATIC_PAGE_PATHS: Record<StaticPageKey, string> = {
  helpCenter: PATHS.SUPPORT_HELP,
  shipping: PATHS.SUPPORT_SHIPPING,
  returns: PATHS.SUPPORT_RETURNS,
  warranty: PATHS.SUPPORT_WARRANTY,
  about: PATHS.ABOUT,
  careers: PATHS.CAREERS,
  contact: PATHS.CONTACT,
  policies: PATHS.POLICIES,
  terms: PATHS.LEGAL_TERMS,
  privacy: PATHS.LEGAL_PRIVACY,
  cookies: PATHS.LEGAL_COOKIES,
}

type StaticPageSection = {
  heading: string
  body: string
}

export type StaticPageContent = {
  eyebrow: string
  title: string
  subtitle?: string
  sections: StaticPageSection[]
}
