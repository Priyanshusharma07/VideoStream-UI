import Link from "next/link";
import Image from "next/image";
import { AppSidebar } from "@/components/app/AppSidebar";
import { PlayIcon, TrendingIcon } from "@/components/icons";
import { getDemoFeed } from "@/lib/demo/content";

const DISCOVER_CATEGORIES = [
  { id: "gaming", label: "Gaming", gradient: "from-emerald-500 to-cyan-400", emoji: "🎮" },
  { id: "music", label: "Music", gradient: "from-purple-500 to-pink-500", emoji: "🎵" },
  { id: "movies", label: "Movies", gradient: "from-orange-500 to-red-500", emoji: "🎬" },
  { id: "tech", label: "Technology", gradient: "from-blue-500 to-indigo-500", emoji: "💻" },
  { id: "sports", label: "Sports", gradient: "from-yellow-500 to-orange-400", emoji: "⚽" },
  { id: "anime", label: "Anime", gradient: "from-pink-500 to-rose-500", emoji: "⛩️" },
  { id: "art", label: "Art & Design", gradient: "from-teal-500 to-emerald-400", emoji: "🎨" },
  { id: "education", label: "Education", gradient: "from-cyan-500 to-blue-500", emoji: "📚" },
] as const;

export default function DiscoverPage() {
  const feed = getDemoFeed();

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0">
          <AppSidebar
            activePath="/discover"
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
        <div className="absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <main className="mx-auto w-full max-w-[1400px] px-5 py-6 lg:pl-[19.5rem]">
        <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
          {/* Header */}
          <div className="flex items-center gap-3">
            <TrendingIcon className="h-6 w-6 text-emerald-400" />
            <div>
              <h1 className="text-xl font-semibold">Discover</h1>
              <p className="text-xs text-white/45">Browse by category or explore trending content</p>
            </div>
          </div>

          {/* Category grid */}
          <section className="mt-8">
            <div className="text-[10px] font-semibold tracking-[0.22em] text-white/35 mb-4">
              BROWSE CATEGORIES
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {DISCOVER_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/explore?q=${encodeURIComponent(cat.label)}`}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:ring-white/20"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-15 transition group-hover:opacity-25`}
                  />
                  <div className="relative">
                    <span className="text-3xl">{cat.emoji}</span>
                    <div className="mt-3 text-sm font-semibold text-white/90 group-hover:text-white">
                      {cat.label}
                    </div>
                    <div className="mt-1 text-xs text-white/40">Explore →</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Trending live streams */}
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-semibold tracking-[0.22em] text-white/35">
                TRENDING LIVE NOW
              </div>
              <Link href="/feed" className="text-xs text-cyan-300 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {feed.trending
                .filter((v) => v.kind === "live")
                .map((v) => (
                  <Link
                    key={v.id}
                    href={`/watch/${v.id}`}
                    className="group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:ring-white/20"
                  >
                    <div className="relative h-40">
                      <Image
                        src={v.thumbnailUrl}
                        alt={v.title}
                        width={960}
                        height={540}
                        className="h-full w-full object-cover opacity-80 transition group-hover:opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur ring-1 ring-white/15">
                          <PlayIcon className="h-6 w-6 translate-x-[1px] text-white" />
                        </span>
                      </div>

                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="rounded-md bg-cyan-400 px-2 py-0.5 text-[10px] font-bold tracking-widest text-black">
                          LIVE
                        </span>
                        <span className="rounded-md bg-black/50 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur">
                          {v.viewsLabel}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="truncate text-sm font-semibold text-white">
                          {v.title}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Image
                            src={v.creator.avatarUrl}
                            alt={v.creator.name}
                            width={20}
                            height={20}
                            className="rounded-md ring-1 ring-white/10"
                          />
                          <span className="text-xs text-white/65">{v.creator.name}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* Top creators to follow */}
          <section className="mt-10">
            <div className="text-[10px] font-semibold tracking-[0.22em] text-white/35 mb-4">
              SUGGESTED CREATORS
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {feed.subscriptions.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="relative shrink-0">
                    <Image
                      src={creator.avatarUrl}
                      alt={creator.name}
                      width={40}
                      height={40}
                      className="rounded-xl ring-1 ring-white/10"
                    />
                    {creator.isLive && (
                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-black/60" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white/85">{creator.name}</div>
                    <div className="text-xs text-white/40">
                      {creator.isLive ? (
                        <span className="text-emerald-400">● Live now</span>
                      ) : (
                        "Offline"
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-xl bg-sky-500/15 px-3 py-1.5 text-[10px] font-semibold text-sky-300 ring-1 ring-sky-500/30 hover:bg-sky-500/25"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
