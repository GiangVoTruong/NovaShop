import type { ReactNode } from 'react'
import { cx } from '@/features/NovaShop/shared/ui/cx'

interface AdminSectionProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  flush?: boolean
}

export default function AdminSection({
  title,
  subtitle,
  action,
  children,
  className,
  flush = false,
}: AdminSectionProps) {
  return (
    <section
      className={cx(
        'border border-slate-200 bg-white shadow-sm',
        flush ? 'overflow-hidden rounded-3xl' : 'rounded-3xl p-6',
        className,
      )}
    >
      <div
        className={cx(
          'flex items-start justify-between gap-3',
          flush ? 'border-b border-slate-200 px-6 py-5' : 'mb-5',
        )}
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className={cx(flush && 'admin-table-surface')}>{children}</div>
    </section>
  )
}
