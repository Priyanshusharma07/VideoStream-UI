"use client";

import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/ToastProvider";
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
  const toast = useToast();

  const handleFollow = (name: string) => {
    toast.push({
      variant: "success",
      title: "Following",
      message: `You are now following ${name}.`,
    });
  };

  return (
    <div className="py-12 px-[5vw]">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary">explore</span>
          Discover
        </h1>
        <p className="mt-2 text-white/50 font-medium">Browse by category or explore trending content from the community.</p>
      </header>

      {/* Category grid */}
      <section className="mb-20">
        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">
          Browse Categories
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {DISCOVER_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?q=${encodeURIComponent(cat.label)}`}
              className="group relative overflow-hidden rounded-[2rem] p-8 glass-panel hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-5 transition-opacity group-hover:opacity-10`}
              />
              <div className="relative text-center">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">{cat.emoji}</div>
                <div className="text-sm font-black text-white group-hover:text-primary transition-colors">
                  {cat.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending live streams */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            Trending Live Now
          </div>
          <Link href="/live" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">
            View All Live
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {feed.trending
            .filter((v) => v.kind === "live")
            .slice(0, 3)
            .map((v) => (
              <Link
                key={v.id}
                href={`/watch/${v.id}`}
                className="group relative aspect-video overflow-hidden rounded-[2.5rem] glass-card group"
              >
                <Image
                  src={v.thumbnailUrl}
                  alt={v.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-secondary text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                      LIVE
                    </span>
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                      {v.viewsLabel} VIEWERS
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors line-clamp-1">
                    {v.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black text-white">
                      {v.creator.name[0]}
                    </div>
                    <span className="text-xs font-bold text-white/50">{v.creator.name}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Top creators */}
      <section>
        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">
          Suggested Creators
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {feed.subscriptions.map((creator) => (
            <div
              key={creator.id}
              className="flex items-center gap-4 rounded-[2rem] p-6 glass-panel hover:border-white/10 transition-all"
            >
              <div className="relative shrink-0">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-black text-white shadow-lg`}>
                  {creator.name[0]}
                </div>
                {creator.isLive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary border-4 border-[#080a0f]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-black text-white tracking-tight">{creator.name}</div>
                <div className="text-[10px] font-black uppercase tracking-widest mt-1">
                  {creator.isLive ? (
                    <span className="text-secondary">● Live now</span>
                  ) : (
                    <span className="text-white/20">Offline</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleFollow(creator.name)}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-primary hover:text-black transition-all group"
              >
                <span className="material-symbols-outlined text-sm font-black group-hover:scale-110 transition-transform">person_add</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

