export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
          <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-white/10" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
              >
                <div className="aspect-video animate-pulse bg-white/10" />
                <div className="space-y-2 px-4 py-3">
                  <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-2/5 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-1/4 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

