export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080a0f] px-[5vw] py-8">
      {/* Skeleton: page header */}
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-white/8 mb-3" />
        <div className="h-4 w-72 animate-pulse rounded-lg bg-white/5" />
      </div>

      {/* Skeleton: hero card */}
      <div className="relative rounded-3xl overflow-hidden aspect-[21/9] min-h-[260px] animate-pulse bg-white/5 mb-8 border border-white/5">
        <div className="absolute bottom-6 left-6 space-y-3">
          <div className="h-4 w-20 rounded-full bg-white/10" />
          <div className="h-8 w-80 rounded-xl bg-white/10" />
          <div className="h-4 w-56 rounded-lg bg-white/8" />
          <div className="flex gap-3 mt-2">
            <div className="h-10 w-32 rounded-full bg-white/10" />
            <div className="h-10 w-28 rounded-full bg-white/8" />
          </div>
        </div>
      </div>

      {/* Skeleton: section title */}
      <div className="h-6 w-40 animate-pulse rounded-lg bg-white/8 mb-5" />

      {/* Skeleton: card grid — portrait */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div
              className="aspect-[2/3] rounded-2xl animate-pulse bg-white/5 border border-white/5"
              style={{ animationDelay: `${i * 80}ms` }}
            />
            <div className="h-4 w-4/5 animate-pulse rounded bg-white/8" style={{ animationDelay: `${i * 80}ms` }} />
            <div className="h-3 w-3/5 animate-pulse rounded bg-white/5" style={{ animationDelay: `${i * 80}ms` }} />
          </div>
        ))}
      </div>

      {/* Skeleton: second section */}
      <div className="h-6 w-36 animate-pulse rounded-lg bg-white/8 mb-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div
              className="aspect-video rounded-2xl animate-pulse bg-white/5 border border-white/5"
              style={{ animationDelay: `${i * 100}ms` }}
            />
            <div className="h-4 w-4/5 animate-pulse rounded bg-white/8" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
