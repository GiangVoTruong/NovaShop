import type { ReactNode } from 'react'
import { cx } from '../../../shared/ui/cx'

const TONE_CLASS = {
  fuchsia: 'from-fuchsia-500/20 to-purple-500/10 text-fuchsia-300',
  emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-300',
  cyan: 'from-cyan-500/20 to-blue-500/10 text-cyan-300',
  amber: 'from-amber-500/20 to-orange-500/10 text-amber-300',
  rose: 'from-rose-500/20 to-pink-500/10 text-rose-300',
  indigo: 'from-indigo-500/20 to-violet-500/10 text-indigo-300',
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
    <article className="glass-dark rounded-3xl p-5 ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:ring-fuchsia-400/20">
      <div className="flex items-start justify-between gap-3">
        <div
          className={cx(
            'flex size-11 items-center justify-center rounded-2xl bg-linear-to-br',
            TONE_CLASS[tone],
          )}
        >
          {icon}
        </div>
        {change && (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300">
            {change}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-extrabold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </article>
  )
}
