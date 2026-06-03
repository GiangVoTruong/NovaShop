import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  eyebrow: string
  title: string
  titleHighlight?: string
  description?: string
  actions?: ReactNode
}

export default function AdminPageHeader({
  eyebrow,
  title,
  titleHighlight,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}{' '}
          {titleHighlight && <span className="text-blue-300">{titleHighlight}</span>}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}
