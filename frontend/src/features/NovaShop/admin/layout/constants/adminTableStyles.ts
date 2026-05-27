export const ADMIN_TABLE_PAGE_SIZE = 10

/** Class chữ trong cell — đồng bộ dark admin */
export const adminTableText = {
  primary: 'font-semibold text-white',
  secondary: 'text-xs text-slate-400',
  muted: 'text-slate-500',
  body: 'text-slate-300',
  money: 'font-bold text-fuchsia-300',
  code: 'font-mono font-semibold text-fuchsia-200',
  emphasis: 'font-semibold text-slate-200',
  danger: 'font-bold text-rose-400',
  warning: 'inline-flex items-center gap-1 text-xs font-bold text-amber-400',
} as const

export const adminTableAvatar =
  'size-10 shrink-0 rounded-xl object-cover ring-1 ring-white/15'

export const adminTableAvatarLg =
  'size-11 shrink-0 rounded-xl object-cover ring-1 ring-white/15'

export const adminTablePagination = {
  pageSize: ADMIN_TABLE_PAGE_SIZE,
  showSizeChanger: false,
} as const
