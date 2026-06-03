interface AdminEmptyStateProps {
  message: string
}

export default function AdminEmptyState({ message }: AdminEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-14 text-center text-sm text-slate-500">
      {message}
    </div>
  )
}
