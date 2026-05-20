import type { HTMLAttributes } from 'react'
import { cx } from './cx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padded?: boolean
  glass?: boolean
}

export default function Card({
  className,
  children,
  hover,
  padded,
  glass,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(
        'rounded-3xl',
        glass
          ? 'glass'
          : 'border border-slate-200/70 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)]',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-15px_rgba(168,85,247,0.25)]',
        padded && 'p-6',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
