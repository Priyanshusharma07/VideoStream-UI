"use client";

import Link from "next/link";
import { useMemo, useState, useTransition, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getApi } from "@/services/api-client";
import { SearchIcon } from "@/components/icons";

type ApiError = { code: string; message: string };
type SearchItem = {
  id: string;
  title: string;
  year?: number;
  kind: "movie" | "show" | "live";
};

function ExploreInner({ initialQ }: { initialQ: string }) {
  const [query, setQuery] = useState(initialQ);
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<SearchItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  const doSearch = useCallback(
    (q: string) => {
      startTransition(async () => {
        setError(null);
        const payload = await getApi<{ items: SearchItem[] }>(
          `/search?q=${encodeURIComponent(q)}`
        );
        
        if (!payload.ok) {
          setError(payload.error.message);
          return;
        }

        setResults(Array.isArray(payload.data.items) ? payload.data.items : []);
      });
    },
    [startTransition],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    doSearch(q);
  }

  useEffect(() => {
    if (initialQ.length >= 2) doSearch(initialQ);
  }, [initialQ, doSearch]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight">Explore</h1>
        <p className="mt-2 text-white/50 font-medium">
          Search across thousands of cinematic masterpieces.
        </p>
      </div>

      <form onSubmit={onSubmit} className="max-w-3xl mb-12">
        <div className="flex items-center gap-3 glass-panel p-2 rounded-2xl">
          <div className="flex flex-1 items-center gap-3 bg-white/5 px-5 py-3 rounded-xl border border-white/5 focus-within:border-primary/50 transition-all">
            <SearchIcon className="h-5 w-5 text-white/30" />
            <input
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
              placeholder="Search movies, creators, or genres..."
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!canSearch || isPending}
            className="h-11 px-8 rounded-xl bg-primary text-black text-xs font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-sm font-bold text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}`}
            className="group glass-card p-6 rounded-[1.5rem] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black tracking-[0.2em] text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase">
                  {item.kind}
                </span>
                {item.year && (
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    {item.year}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight">
                {item.title}
              </h3>
            </div>
            <div className="mt-6 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/40">
              <span>View Details</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>

      {results.length === 0 && query.trim().length > 0 && !isPending && (
        <div className="text-center py-20 glass-panel rounded-[2rem]">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-4">search_off</span>
          <p className="text-white/40 font-bold">No results found for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {results.length === 0 && query.trim().length === 0 && (
        <div className="text-center py-20 text-white/20 font-black uppercase tracking-[0.3em] text-xs">
          Enter a query to begin discovery
        </div>
      )}
    </div>
  );
}

function ExploreWithParams() {
  const searchParams = useSearchParams();
  const initialQ = (searchParams.get("q") ?? "").trim();
  return <ExploreInner key={initialQ} initialQ={initialQ} />;
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm font-black text-white/20 uppercase tracking-widest">
          Synchronizing...
        </div>
      }
    >
      <ExploreWithParams />
    </Suspense>
  );
}

