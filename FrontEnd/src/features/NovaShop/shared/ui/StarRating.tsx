import { Star } from 'lucide-react'
import { cx } from './cx'

interface StarRatingProps {
  value: number
  size?: number
  className?: string
  showValue?: boolean
}

export default function StarRating({
  value,
  size = 16,
  className,
  showValue,
}: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, idx) => idx + 1)
  return (
    <div className={cx('inline-flex items-center gap-1', className)}>
      <div className="flex items-center">
        {stars.map((position) => {
          const filled = position <= Math.round(value)
          return (
            <Star
              key={position}
              width={size}
              height={size}
              className={cx(
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 text-slate-200',
              )}
            />
          )
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-slate-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}
