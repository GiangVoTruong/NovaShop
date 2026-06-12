import { PATHS } from '@/router/paths'
import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Cookie,
  FileText,
  HelpCircle,
  Mail,
  RotateCcw,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'
import { STATIC_PAGE_PATHS, type StaticPageKey } from './staticPage.constants'

export type StaticPageAccent = 'fuchsia' | 'cyan' | 'amber' | 'emerald' | 'indigo' | 'slate'

export type StaticPageTheme = {
  icon: LucideIcon
  accent: StaticPageAccent
  relatedKeys: readonly StaticPageKey[]
}

export const STATIC_PAGE_ACCENTS: Record<
  StaticPageAccent,
  {
    iconWrap: string
    navActive: string
    navIdle: string
    dot: string
    callout: string
  }
> = {
  fuchsia: {
    iconWrap: 'bg-fuchsia-100 text-fuchsia-600',
    navActive: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25',
    navIdle: 'text-slate-600 hover:bg-fuchsia-50 hover:text-fuchsia-700',
    dot: 'bg-fuchsia-500',
    callout: 'border-fuchsia-200 bg-fuchsia-50/80',
  },
  cyan: {
    iconWrap: 'bg-cyan-100 text-cyan-600',
    navActive: 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25',
    navIdle: 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-700',
    dot: 'bg-cyan-500',
    callout: 'border-cyan-200 bg-cyan-50/80',
  },
  amber: {
    iconWrap: 'bg-amber-100 text-amber-600',
    navActive: 'bg-amber-500 text-white shadow-md shadow-amber-500/25',
    navIdle: 'text-slate-600 hover:bg-amber-50 hover:text-amber-700',
    dot: 'bg-amber-500',
    callout: 'border-amber-200 bg-amber-50/80',
  },
  emerald: {
    iconWrap: 'bg-emerald-100 text-emerald-600',
    navActive: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25',
    navIdle: 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700',
    dot: 'bg-emerald-500',
    callout: 'border-emerald-200 bg-emerald-50/80',
  },
  indigo: {
    iconWrap: 'bg-indigo-100 text-indigo-600',
    navActive: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25',
    navIdle: 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700',
    dot: 'bg-indigo-500',
    callout: 'border-indigo-200 bg-indigo-50/80',
  },
  slate: {
    iconWrap: 'bg-slate-100 text-slate-700',
    navActive: 'bg-slate-800 text-white shadow-md shadow-slate-500/20',
    navIdle: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    dot: 'bg-slate-600',
    callout: 'border-slate-200 bg-slate-50',
  },
}

export const STATIC_PAGE_THEMES: Record<StaticPageKey, StaticPageTheme> = {
  helpCenter: { icon: HelpCircle, accent: 'fuchsia', relatedKeys: ['shipping', 'returns', 'warranty'] },
  shipping: { icon: Truck, accent: 'cyan', relatedKeys: ['returns', 'warranty', 'helpCenter'] },
  returns: { icon: RotateCcw, accent: 'amber', relatedKeys: ['shipping', 'warranty', 'helpCenter'] },
  warranty: { icon: ShieldCheck, accent: 'emerald', relatedKeys: ['returns', 'shipping', 'helpCenter'] },
  about: { icon: Sparkles, accent: 'fuchsia', relatedKeys: ['careers', 'contact', 'policies'] },
  careers: { icon: Briefcase, accent: 'indigo', relatedKeys: ['about', 'contact'] },
  contact: { icon: Mail, accent: 'indigo', relatedKeys: ['helpCenter', 'about'] },
  policies: { icon: Scale, accent: 'slate', relatedKeys: ['terms', 'privacy', 'cookies'] },
  terms: { icon: FileText, accent: 'slate', relatedKeys: ['privacy', 'cookies'] },
  privacy: { icon: Shield, accent: 'indigo', relatedKeys: ['terms', 'cookies'] },
  cookies: { icon: Cookie, accent: 'amber', relatedKeys: ['privacy', 'terms'] },
}

export function getRelatedPagePath(pageKey: StaticPageKey): string {
  return STATIC_PAGE_PATHS[pageKey]
}

export const STATIC_PAGE_CONTACT_PATH = PATHS.CONTACT
