"use client";

import Link from "next/link";
import { useMemo, useState, useTransition, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getApi } from "@/services/api-client";

type SearchItem = {
  id: string;
  title: string;
  year?: number;
  kind: "video" | "live";
  category: string;
};

const CATEGORIES = [
  { label: "All", slug: "all", icon: "apps" },
  { label: "Cinema", slug: "cinema", icon: "movie" },
  { label: "Gaming", slug: "gaming", icon: "sports_esports" },
  { label: "Music", slug: "music", icon: "music_note" },
  { label: "Tech", slug: "tech", icon: "code" },
  { label: "Documentary", slug: "documentary", icon: "camera_roll" },
  { label: "Sports", slug: "sports", icon: "sports_soccer" },
  { label: "Animation", slug: "animation", icon: "animation" },
  { label: "Live", slug: "live", icon: "sensors" },
];

const TRENDING_TAGS = ["#NeonDreams", "#AI2025", "#LeagueFinals", "#EarthUncharted", "#DigitalFlow", "#UltraHD4K"];

const FEATURED_CHANNELS = [
  { name: "Cosmic Films", genre: "Cinema", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvqEiaQ1OzUevZ4ja116O_14hhes2LIlQdQIYCoH3BHuhshBjAn5eo9fYfU3WtnjGAUN90LoQeUMDdALvl7ZrtFokdjX82dQIqJHQcm3RK09cxjrfO1B-x8GgNhVv00kQd5PVWO3YZaCbSecq71gQZwF9GtlXSUJUqF1YNOP-2FZRX0bpyKlosvP8WGJNCpdKvAIcNPCzFT3ugOu3PryZIoc-56VPYsE0JQx8tKcKTdl59JoDp0h45_sS8wjmzKQSBAcvMwp5hsKY1", subs: "2.4M" },
  { name: "Tech Frontiers", genre: "Technology", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPMlG8ldddBaqCjLWShoZnVr8t3nWE90vdMdGajeHyJzKvdFOCrMDNh0nVYK5yNIU8d9vEwT-0ZXTzbLZNUzH9Z3LDAx-aX0U_X4JAakey6t9jDlHAAkcW1UIQA3f_jnJHXSpx949OcH1LoDEicMTYjFHxu6p_wkq37Jeabac4sP8SvL1s46VEyXkHO910ZnSHfbcgBFH-TChbqD32dvAYDVYe6e7yoyx6CLyrKr4sGm90Wwz9sId9dANoN2Xy1ltkcWjGg2TGCvpL", subs: "1.1M" },
  { name: "Echoes Music", genre: "Music", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEbLx0IgIDE0riSZIC6YpTea-WnILUwXmIxCt7x6vuZqk4vhPeLu8ndIM77JnOGwE2iVkipOLMjyEmjjmLF3yk-qOjcuqyvEEA-CY4XqE9dxSBYZyFAlvYvmksHuawgkK0aIUufu5YfDn8Ksf2oV4Xni1RmflhH3VA-yL30tV75CvFwTVnvXtH4N0PaRk90QNeCSLUBHn_mYufce12m_zxi0byRHOESWpvG3I5dkGplHYc14sPghCMu9BOOmzwtQQ-I50TnpEVIoJy", subs: "890K" },
  { name: "Peak Sports", genre: "Sports", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoSb6ntXKGLMhgyl4LIaWN4fvAK_BNeuzMb4r8hOiDXnNVabuZofZUT0FX3ByvszRLoRhxd8pSNCw1lm_Ena5VcS3380quMsd-NOylM7eVfHMx1BRzgTmPFgjTg5oZg40Cpc6cMrR42EpozQVCNY-9EfjVnzFQPQ6R4cCoc1Y93TOlDAK3zSlykAoEeSjXJ3POX5tJBgImoyKVhv3qfRF38euu6J3NBtAB_xXZ-w1OCw00Bv2Pj4msDhJk3HBPDjLdcAUyV9eaTK_q", subs: "3.2M" },
];

function ExploreInner({ initialQ, initialCat }: { initialQ: string; initialCat: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQ);
  const [activeCategory, setActiveCategory] = useState(initialCat || "all");
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<SearchItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  const doSearch = useCallback((q: string, cat: string = "all") => {
    startTransition(async () => {
      setError(null);
      setHasSearched(true);
      const url = `/videos/search?q=${encodeURIComponent(q)}&cat=${encodeURIComponent(cat)}`;
      const payload = await getApi<{ items: SearchItem[] }>(url);
      if (!payload.ok) { setError(payload.error.message); return; }
      setResults(Array.isArray(payload.data.items) ? payload.data.items : []);
    });
  }, []);

  useEffect(() => {
    if (initialQ.length >= 2 || initialCat !== "all") {
      doSearch(initialQ, initialCat);
    }
  }, [initialQ, initialCat, doSearch]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2 && activeCategory === "all") { setResults([]); return; }
    doSearch(q, activeCategory);
  }

  const handleCategory = (slug: string) => {
    setActiveCategory(slug);
    router.push(`/explore?q=${encodeURIComponent(query)}&cat=${slug}`);
  };

  const showDiscovery = !hasSearched && results.length === 0;

  return (
    <div className="min-h-screen pb-24">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="px-[5vw] pt-6 pb-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-1">Explore</h1>
        <p className="text-white/40 text-sm font-medium">Discover content across the CINEVIEW universe</p>
      </div>

      {/* ── Search Bar ─────────────────────────────────────────────── */}
      <div className="px-[5vw] mb-6">
        <form onSubmit={onSubmit}>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-primary/50 focus-within:bg-primary/5 transition-all max-w-3xl">
            <span className="material-symbols-outlined text-white/30 text-[20px] flex-shrink-0">
              {isPending ? "sync" : "search"}
            </span>
            <input
              className={`flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25 ${isPending ? "animate-pulse" : ""}`}
              placeholder="Search movies, creators, genres, tags..."
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); setResults([]); setHasSearched(false); }}
                className="text-white/20 hover:text-white/60 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="h-9 px-5 rounded-xl bg-primary-container text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              {isPending ? "…" : "Search"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Category Pills ──────────────────────────────────────────── */}
      <div className="px-[5vw] mb-8">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(({ label, slug, icon }) => (
            <button
              key={slug}
              onClick={() => handleCategory(slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === slug
                  ? "bg-primary-container text-white shadow-[0_0_12px_rgba(0,102,255,0.35)]"
                  : "bg-white/5 border border-white/8 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ───────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-[5vw] mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 px-5 py-4 text-sm font-semibold text-red-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </div>
      )}

      {/* ── Search Results ──────────────────────────────────────────── */}
      {hasSearched && (
        <div className="px-[5vw]">
          {results.length > 0 ? (
            <>
              <p className="text-white/40 text-sm font-medium mb-5">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query || activeCategory}&rdquo;
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={`/watch/${item.id}`}
                    className="group glass-card p-5 rounded-2xl flex flex-col justify-between hover:border-primary/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase border ${
                          item.kind === "live"
                            ? "text-[#FF0055] bg-[#FF0055]/10 border-[#FF0055]/20"
                            : "text-primary bg-primary/10 border-primary/20"
                        }`}>
                          {item.kind === "live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF0055] animate-pulse mr-1.5" />}
                          {item.kind}
                        </span>
                        {item.year && <span className="text-[10px] font-bold text-white/30">{item.year}</span>}
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">{item.title}</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{item.category}</p>
                    </div>
                    <div className="mt-5 flex items-center justify-between text-[11px] font-semibold text-white/30">
                      <span>View Details</span>
                      <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : !isPending && (
            <div className="text-center py-20 glass-panel rounded-3xl">
              <span className="material-symbols-outlined text-5xl text-white/15 mb-4 block">search_off</span>
              <p className="text-white/40 font-bold text-lg mb-1">No results found</p>
              <p className="text-white/25 text-sm">Try different keywords or browse categories above</p>
            </div>
          )}
        </div>
      )}

      {/* ── Discovery State (no search yet) ─────────────────────────── */}
      {showDiscovery && (
        <div className="px-[5vw] space-y-12">
          {/* Trending Tags */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
              Trending Tags
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag.replace("#", "")); doSearch(tag.replace("#", "")); }}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/10 hover:text-white hover:border-primary/30 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Featured Channels */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                Featured Channels
              </h2>
              <Link href="/feed" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                View all
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {FEATURED_CHANNELS.map((ch) => (
                <Link key={ch.name} href={`/explore?q=${encodeURIComponent(ch.name)}`}
                  className="group relative rounded-2xl overflow-hidden aspect-square glass-border block">
                  <img src={ch.img} alt={ch.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="text-white font-bold text-sm leading-snug">{ch.name}</p>
                    <p className="text-white/50 text-[11px] font-medium">{ch.subs} subscribers</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Genre Grid */}
          <section>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-white/40 text-[18px]">category</span>
              Browse by Genre
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: "Cinema", icon: "movie", color: "from-red-600/30 to-orange-600/10", border: "border-red-500/20", text: "text-red-400" },
                { label: "Sci-Fi", icon: "rocket_launch", color: "from-blue-600/30 to-cyan-600/10", border: "border-blue-500/20", text: "text-blue-400" },
                { label: "Documentary", icon: "camera_roll", color: "from-emerald-600/30 to-teal-600/10", border: "border-emerald-500/20", text: "text-emerald-400" },
                { label: "Gaming", icon: "sports_esports", color: "from-purple-600/30 to-pink-600/10", border: "border-purple-500/20", text: "text-purple-400" },
                { label: "Music", icon: "music_note", color: "from-pink-600/30 to-rose-600/10", border: "border-pink-500/20", text: "text-pink-400" },
                { label: "Sports", icon: "sports_soccer", color: "from-green-600/30 to-lime-600/10", border: "border-green-500/20", text: "text-green-400" },
                { label: "Tech", icon: "memory", color: "from-sky-600/30 to-indigo-600/10", border: "border-sky-500/20", text: "text-sky-400" },
                { label: "Animation", icon: "animation", color: "from-yellow-600/30 to-amber-600/10", border: "border-yellow-500/20", text: "text-yellow-400" },
              ].map(({ label, icon, color, border, text }) => (
                <button
                  key={label}
                  onClick={() => handleCategory(label.toLowerCase())}
                  className={`group relative p-5 rounded-2xl bg-gradient-to-br ${color} border ${border} text-left transition-all hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span className={`material-symbols-outlined text-[28px] ${text} mb-3 block`}>{icon}</span>
                  <p className="text-white font-bold text-sm leading-snug">{label}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ExploreWithParams() {
  const searchParams = useSearchParams();
  const initialQ = (searchParams.get("q") ?? "").trim();
  const initialCat = (searchParams.get("cat") ?? "all").trim();
  return <ExploreInner key={`${initialQ}-${initialCat}`} initialQ={initialQ} initialCat={initialCat} />;
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ExploreWithParams />
    </Suspense>
  );
}
