export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-2xl bg-black/35 ring-1 ring-white/10">
            <div className="aspect-video animate-pulse bg-white/10" />
            <div className="space-y-3 p-6">
              <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
            </div>
          </div>

          <div className="rounded-2xl bg-black/35 p-5 ring-1 ring-white/10">
            <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
                >
                  <div className="aspect-video animate-pulse bg-white/10" />
                  <div className="space-y-2 px-4 py-3">
                    <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-2/5 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

