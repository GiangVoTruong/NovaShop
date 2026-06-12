import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { BUTTON_SIZE_CLASS, BUTTON_VARIANT_CLASS } from './button.constants'
import { cx } from './cx'

type Variant =
  | 'gradient'
  | 'dark'
  | 'glass'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'white'
  | 'blue'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  glow?: boolean
  loading?: boolean
}

export default function Button({
  variant = 'gradient',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth,
  glow,
  loading,
  className,
  children,
  type = 'button',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cx(
        'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl font-semibold tracking-tight transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 focus-visible:ring-offset-2',
        BUTTON_VARIANT_CLASS[variant],
        BUTTON_SIZE_CLASS[size],
        fullWidth && 'w-full',
        glow &&
          variant === 'gradient' &&
          'shadow-[0_20px_50px_-15px_rgba(217,70,239,0.6)] hover:shadow-[0_25px_60px_-15px_rgba(217,70,239,0.7)]',
        className,
      )}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-2">
        {loading ? <Loader2 className="size-4 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </span>
      {variant === 'gradient' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"
        />
      )}
    </button>
  )
}
