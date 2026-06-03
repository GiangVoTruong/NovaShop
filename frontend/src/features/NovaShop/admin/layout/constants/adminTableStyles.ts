export const ADMIN_TABLE_PAGE_SIZE = 10

/** Class chữ trong cell — đồng bộ admin light */
export const adminTableText = {
  primary: 'font-semibold text-slate-900',
  secondary: 'text-xs text-slate-400',
  muted: 'text-slate-500',
  body: 'text-slate-700',
  money: 'font-bold text-blue-700',
  code: 'font-mono font-semibold text-blue-700',
  emphasis: 'font-semibold text-slate-800',
  danger: 'font-bold text-rose-600',
  warning: 'inline-flex items-center gap-1 text-xs font-bold text-amber-600',
} as const

export const adminTableAvatar =
  'size-10 shrink-0 rounded-xl object-cover ring-1 ring-slate-200'

export const adminTableAvatarLg =
  'size-11 shrink-0 rounded-xl object-cover ring-1 ring-slate-200'

export const adminTablePagination = {
  pageSize: ADMIN_TABLE_PAGE_SIZE,
  showSizeChanger: false,
} as const
