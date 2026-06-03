import type { ReactNode } from 'react'
import { cx } from '../../../shared/ui/cx'

const TONE_CLASS = {
  fuchsia: 'border-blue-200 bg-blue-50 text-blue-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
} as const

interface StatCardProps {
  label: string
  value: string
  change?: string
  icon: ReactNode
  tone?: keyof typeof TONE_CLASS
}

export default function StatCard({
  label,
  value,
  change,
  icon,
  tone = 'fuchsia',
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-150 hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className={cx('flex size-11 items-center justify-center rounded-xl border', TONE_CLASS[tone])}>
          {icon}
        </div>
        {change && (
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
            {change}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </article>
  )
}
