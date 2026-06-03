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
        'overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm',
        className,
      )}
    >
      {toolbar && (
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
          {toolbar}
        </div>
      )}
      <div className="admin-table-surface">{children}</div>
    </div>
  )
}
