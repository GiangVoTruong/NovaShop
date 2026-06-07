export default function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] animate-pulse space-y-10 px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <div className="h-4 w-64 rounded-lg bg-slate-200/80" />

      <div className="h-96 rounded-3xl bg-slate-200/70 lg:h-auto lg:aspect-[16/7]" />

      <div className="h-80 rounded-3xl bg-slate-200/70" />
    </div>
  )
}
