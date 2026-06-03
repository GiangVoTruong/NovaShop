import type { ReactNode } from 'react'
import { cx } from '@/features/NovaShop/shared/ui/cx'

interface AdminShellProps {
  children: ReactNode
  className?: string
}

export default function AdminShell({ children, className }: AdminShellProps) {
  return <div className={cx('mx-auto w-full max-w-[1480px]', className)}>{children}</div>
}
