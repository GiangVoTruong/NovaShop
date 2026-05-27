import type { ReactNode } from 'react'
import AdminDataPanel from './AdminDataPanel'
import AdminPageHeader from './AdminPageHeader'
import AdminShell from './AdminShell'

interface AdminListPageProps {
  eyebrow: string
  title: string
  titleHighlight?: string
  description?: string
  actions?: ReactNode
  summary?: ReactNode
  toolbar?: ReactNode
  children: ReactNode
}

export default function AdminListPage({
  eyebrow,
  title,
  titleHighlight,
  description,
  actions,
  summary,
  toolbar,
  children,
}: AdminListPageProps) {
  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow={eyebrow}
        title={title}
        titleHighlight={titleHighlight}
        description={description}
        actions={actions}
      />
      {summary && <div className="mb-6">{summary}</div>}
      <AdminDataPanel toolbar={toolbar}>{children}</AdminDataPanel>
    </AdminShell>
  )
}
