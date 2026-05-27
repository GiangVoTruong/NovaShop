import type { ReactNode } from 'react'
import { cx } from '@/features/NovaShop/shared/ui/cx'

interface AdminDataPanelProps {
  toolbar?: ReactNode
  children: ReactNode
  className?: string
}

export default function AdminDataPanel({ toolbar, children, className }: AdminDataPanelProps) {
  return (
    <div
      className={cx(
        'glass-dark overflow-hidden rounded-3xl ring-1 ring-white/10',
        className,
      )}
    >
      {toolbar && (
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center">
          {toolbar}
        </div>
      )}
      <div className="admin-table-surface">{children}</div>
    </div>
  )
}
