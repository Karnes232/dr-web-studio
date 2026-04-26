export default function Loading() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-orange-50 animate-pulse">
      {/* Hero skeleton */}
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="h-10 w-2/3 max-w-lg rounded-xl bg-slate-200" />
        <div className="h-6 w-1/2 max-w-sm rounded-lg bg-slate-200" />
        <div className="h-10 w-36 rounded-lg bg-slate-200 mt-4" />
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  )
}
