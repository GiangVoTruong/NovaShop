import type { ReactNode } from 'react'
import AdminPageHeader from './AdminPageHeader'
import AdminShell from './AdminShell'

interface AdminPageProps {
  eyebrow: string
  title: string
  titleHighlight?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export default function AdminPage({
  eyebrow,
  title,
  titleHighlight,
  description,
  actions,
  children,
  className,
}: AdminPageProps) {
  return (
    <AdminShell className={className}>
      <AdminPageHeader
        eyebrow={eyebrow}
        title={title}
        titleHighlight={titleHighlight}
        description={description}
        actions={actions}
      />
      {children}
    </AdminShell>
  )
}
