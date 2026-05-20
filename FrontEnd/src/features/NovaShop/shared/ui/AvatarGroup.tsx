import { cx } from './cx'

interface AvatarGroupProps {
  avatars: { src: string; alt: string }[]
  max?: number
  size?: number
  className?: string
}

export default function AvatarGroup({
  avatars,
  max = 4,
  size = 32,
  className,
}: AvatarGroupProps) {
  const shown = avatars.slice(0, max)
  const remaining = avatars.length - shown.length
  return (
    <div className={cx('flex -space-x-2', className)}>
      {shown.map((avatar) => (
        <img
          key={avatar.src}
          src={avatar.src}
          alt={avatar.alt}
          width={size}
          height={size}
          className="rounded-full border-2 border-white object-cover shadow-sm"
        />
      ))}
      {remaining > 0 && (
        <div
          style={{ width: size, height: size }}
          className="flex items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600"
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
