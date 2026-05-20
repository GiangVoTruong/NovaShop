export const BUTTON_VARIANT_CLASS = {
  gradient:
    'text-white bg-linear-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-indigo-600 active:scale-[0.98]',
  dark: 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]',
  glass:
    'bg-white/15 text-white border border-white/30 backdrop-blur hover:bg-white/25 active:scale-[0.98]',
  outline:
    'bg-white text-slate-900 border border-slate-200 hover:border-slate-900 hover:shadow-md',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger:
    'bg-linear-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600',
  white: 'bg-white text-slate-900 hover:shadow-xl active:scale-[0.98]',
} as const

export const BUTTON_SIZE_CLASS = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
  xl: 'h-16 px-9 text-lg',
} as const
