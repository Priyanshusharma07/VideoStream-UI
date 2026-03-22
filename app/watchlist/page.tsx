import Link from "next/link";
import Image from "next/image";
import { AppSidebar } from "@/components/app/AppSidebar";
import { BookmarkIcon, PlayIcon } from "@/components/icons";
import { RemoveFromWatchlistButton } from "@/components/watchlist/RemoveFromWatchlistButton";
import { getDemoFeed } from "@/lib/demo/content";

export default function WatchlistPage() {
  const feed = getDemoFeed();

  // Use demo videos as saved watchlist items
  const saved = feed.forYou.map((v, i) => ({
    ...v,
    savedAt: ["Today", "Yesterday", "3 days ago", "Last week", "2 weeks ago", "1 month ago"][i] ?? "Saved",
    progressPct: [0, 42, 88, 15, 67, 0][i] ?? 0,
  }));

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0">
          <AppSidebar
            activePath="/watchlist"
            subscriptions={feed.subscriptions}
            user={{
              name: "Arjun Sharma",
              planLabel: "Premium Member",
              avatarUrl: "/demo/avatars/avatar-02.svg",
            }}
          />
        </div>
      </div>

      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-purple-600/8 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 py-6 lg:pl-[19.5rem]">
        <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookmarkIcon className="h-6 w-6 text-sky-400" />
              <div>
                <h1 className="text-xl font-semibold">My Watchlist</h1>
                <p className="text-xs text-white/45">{saved.length} saved videos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10 outline-none focus:ring-sky-500/50">
                <option>Recently Added</option>
                <option>A – Z</option>
                <option>In Progress</option>
              </select>
            </div>
          </div>

          {/* In-progress section */}
          <section className="mt-8">
            <div className="text-[10px] font-semibold tracking-[0.22em] text-white/35 mb-4">
              CONTINUE WATCHING
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {saved
                .filter((v) => v.progressPct > 0 && v.progressPct < 100)
                .map((v) => (
                  <Link
                    key={v.id}
                    href={`/watch/${v.id}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                      <Image
                        src={v.thumbnailUrl}
                        alt={v.title}
                        width={960}
                        height={540}
                        className="h-40 w-full object-cover opacity-90 transition group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/0" />

                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur ring-1 ring-white/15">
                          <PlayIcon className="h-6 w-6 translate-x-[1px] text-white" />
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div
                          className="h-full bg-sky-400"
                          style={{ width: `${v.progressPct}%` }}
                        />
                      </div>

                      {v.kind === "live" && (
                        <span className="absolute left-3 top-3 rounded-md bg-cyan-400 px-2 py-0.5 text-[10px] font-bold tracking-widest text-black">
                          LIVE
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex gap-3">
                      <Image
                        src={v.creator.avatarUrl}
                        alt={v.creator.name}
                        width={28}
                        height={28}
                        className="mt-0.5 h-7 w-7 rounded-lg ring-1 ring-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white/90 group-hover:text-white">
                          {v.title}
                        </div>
                        <div className="mt-0.5 text-xs text-white/45">
                          {v.creator.name} • {v.progressPct}% watched
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* All saved */}
          <section className="mt-10">
            <div className="text-[10px] font-semibold tracking-[0.22em] text-white/35 mb-4">
              ALL SAVED
            </div>
            <div className="space-y-3">
              {saved.map((v) => (
                <Link
                  key={v.id}
                  href={`/watch/${v.id}`}
                  className="group flex items-center gap-4 rounded-2xl bg-white/3 p-3 ring-1 ring-white/8 transition hover:bg-white/6 hover:ring-white/15"
                >
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={v.thumbnailUrl}
                      alt={v.title}
                      width={960}
                      height={540}
                      className="h-full w-full object-cover opacity-90"
                    />
                    {v.durationLabel && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold">
                        {v.durationLabel}
                      </span>
                    )}
                    {v.kind === "live" && (
                      <span className="absolute left-1 top-1 rounded bg-cyan-400 px-1 py-0.5 text-[9px] font-bold tracking-widest text-black">
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white/85 group-hover:text-white">
                      {v.title}
                    </div>
                    <div className="mt-1 text-xs text-white/45">
                      {v.creator.name} • {v.viewsLabel}
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/30">Saved {v.savedAt}</div>
                  </div>

                  <RemoveFromWatchlistButton videoId={v.id} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
