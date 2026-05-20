import type { ReactNode } from 'react'
import { BADGE_DOT, BADGE_TONE_SOFT, BADGE_TONE_SOLID } from './badge.constants'
import { cx } from './cx'

type Tone =
  | 'slate'
  | 'fuchsia'
  | 'purple'
  | 'indigo'
  | 'cyan'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'red'
  | 'blue'
  | 'pink'
  | 'orange'

interface BadgeProps {
  tone?: Tone
  children: ReactNode
  className?: string
  dot?: boolean
  soft?: boolean
}

export default function Badge({
  tone = 'slate',
  children,
  className,
  dot,
  soft = true,
}: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-tight',
        soft ? cx(BADGE_TONE_SOFT[tone], 'ring-1') : BADGE_TONE_SOLID[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cx('size-1.5 rounded-full', soft ? BADGE_DOT[tone] : 'bg-white/80')}
          aria-hidden
        />
      )}
      {children}
    </span>
  )
}
