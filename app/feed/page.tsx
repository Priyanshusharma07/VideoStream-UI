import Link from "next/link";
import Image from "next/image";
import { getFeed } from "@/services/feed-client";
import type { FeedPayload } from "@/types/content";
import { VideoCard } from "@/components/video/VideoCard";
import { FeedErrorRetry } from "./FeedErrorRetry";

export const dynamic = "force-dynamic";
export const metadata = { title: "CINEVIEW — Feed" };

// Helpers
function safeUrl(url: string | null | undefined) {
  return (typeof url === "string" ? url.trim() : "") || "";
}

function normalizeCreator(c: FeedPayload["subscriptions"][number] | null | undefined) {
  return {
    id: c?.id ?? "unknown",
    name: c?.name?.trim() ? c.name : "Unknown",
    avatarUrl: safeUrl(c?.avatarUrl),
    isLive: c?.isLive,
  };
}

function normalizeFeed(feed: FeedPayload): FeedPayload {
  return {
    ...feed,
    subscriptions: (feed.subscriptions ?? []).map(normalizeCreator),
    trending: (feed.trending ?? []).map((v) => ({
      ...v,
      thumbnailUrl: safeUrl(v.thumbnailUrl),
      creator: normalizeCreator(v.creator),
    })),
    forYou: (feed.forYou ?? []).map((v) => ({
      ...v,
      thumbnailUrl: safeUrl(v.thumbnailUrl),
      creator: normalizeCreator(v.creator),
    })),
  };
}

export default async function FeedPage() {
  const result = await getFeed();

  if (!result.ok) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-on-surface px-6">
        <div className="text-center glass-panel p-12 rounded-[2rem] max-w-md">
          <span className="material-symbols-outlined text-5xl text-primary mb-4">error</span>
          <h2 className="text-2xl font-bold text-white mb-2">Could not load feed</h2>
          <p className="text-white/50 mb-8">{result.error.message}</p>
          <FeedErrorRetry />
        </div>
      </div>
    );
  }

  const feed = normalizeFeed(result.data);
  const [hero, ...trendingRest] = feed.trending;
  const trendingGrid = trendingRest.slice(0, 4);
  const forYouList = feed.forYou.slice(0, 12);

  return (
    <div className="pb-32">
      {/* Hero Section */}
      {hero && (
        <section className="relative h-[500px] lg:h-[600px] w-full overflow-hidden mb-12">
          <div className="absolute inset-0 z-0">
            <Image 
              src={hero.thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"} 
              alt={hero.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end px-[5vw] pb-24 max-w-5xl">
            <div className="flex items-center gap-3 mb-4">
              {hero.kind === "live" ? (
                <span className="bg-secondary/20 text-secondary text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md border border-secondary/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  LIVE NOW
                </span>
              ) : (
                <span className="bg-primary/20 text-primary text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md border border-primary/20">
                  TOP TRENDING
                </span>
              )}
              <span className="text-white/70 font-bold text-sm bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5">
                {hero.category || "Cinematic"} • {hero.durationLabel || "Full Length"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter text-glow max-w-3xl">
              {hero.title}
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-2xl line-clamp-3 font-medium leading-relaxed">
              {(hero as any).description || "Experience the next evolution of digital storytelling. A masterpiece of visual fidelity and emotional depth."}
            </p>
            <div className="flex items-center gap-4">
              <Link href={`/watch/${hero.id}`} className="bg-primary text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                <span className="material-symbols-outlined font-black">play_arrow</span>
                Watch Now
              </Link>
              <Link href="/watchlist" className="bg-white/5 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined">add</span>
                My List
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="px-[5vw] space-y-20">
        {/* Trending Section */}
        {trendingGrid.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">trending_up</span>
                  Trending Today
                </h2>
                <p className="text-white/40 mt-1 font-medium">The most watched stories right now</p>
              </div>
              <Link href="/explore" className="text-primary font-bold flex items-center gap-2 hover:underline">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingGrid.map((v) => (
                <VideoCard key={v.id} video={v as any} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Section */}
        {forYouList.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  Recommended For You
                </h2>
                <p className="text-white/40 mt-1 font-medium">Personalized picks based on your activity</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {forYouList.map((v) => (
                <VideoCard key={v.id} video={v as any} />
              ))}
            </div>
          </section>
        )}

        {/* Categories / Promo Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/explore?cat=originals" className="glass-panel rounded-[2.5rem] p-10 flex flex-col justify-between group hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              <div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-4xl">workspace_premium</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Original Series</h3>
                <p className="text-white/50 text-sm font-medium leading-relaxed">Exclusive content created only for CINEGLAS subscribers.</p>
              </div>
              <div className="flex -space-x-3 mt-10">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-[#080a0f] bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-[#080a0f] bg-primary flex items-center justify-center text-[10px] text-black font-black">+24</div>
              </div>
            </Link>

            <div className="md:col-span-2 relative rounded-[2.5rem] overflow-hidden group cursor-pointer h-[350px]">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt="Tech"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-12 flex flex-col justify-end">
                <h3 className="text-4xl font-black text-white mb-3 tracking-tighter">Tech & Science</h3>
                <p className="text-white/70 max-w-md mb-8 font-medium">Explore the frontiers of innovation and discovery through our curated documentaries.</p>
                <Link href="/explore?cat=tech" className="w-fit bg-white text-black px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary transition-all">
                  Explore Channel <span className="material-symbols-outlined text-sm">open_in_new</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

