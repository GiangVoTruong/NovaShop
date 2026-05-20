import { cx } from './cx'

interface SkeletonProps {
  className?: string
}

export default function LoadingSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cx('animate-pulse rounded-xl bg-slate-200/70', className)}
      aria-hidden
    />
  )
}
