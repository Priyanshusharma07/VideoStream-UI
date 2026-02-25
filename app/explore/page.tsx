"use client";

import Link from "next/link";
import { useMemo, useState, useTransition, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HomeHeader } from "@/components/home/HomeHeader";
import { SearchIcon } from "@/components/icons";

type ApiError = { code: string; message: string };
type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

type SearchItem = {
  id: string;
  title: string;
  year?: number;
  kind: "movie" | "show" | "live";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function ExploreInner() {
  const searchParams = useSearchParams();
  const initialQ = (searchParams.get("q") ?? "").trim();
  const [query, setQuery] = useState(initialQ);
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<SearchItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQ && initialQ !== query) setQuery(initialQ);
  }, [initialQ, query]);

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  const doSearch = useCallback(
    (q: string) => {
      startTransition(async () => {
        setError(null);
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const json = (await res.json().catch(() => null)) as unknown;
        if (!isRecord(json) || typeof json.ok !== "boolean") {
          setError("Unexpected response.");
          return;
        }

        const payload = json as ApiResult<{ items: SearchItem[] }>;
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
    <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
      <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
      <p className="mt-1 text-sm text-white/55">
        Search across movies, shows, and live content.
      </p>

      <form onSubmit={onSubmit} className="mt-6 max-w-2xl">
        <div className="flex items-center gap-3 rounded-2xl bg-black/35 p-2 ring-1 ring-white/10 backdrop-blur">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <SearchIcon className="h-5 w-5 text-white/40" />
            <input
              className="w-full bg-transparent text-sm text-white/85 outline-none placeholder:text-white/35"
              placeholder="Try: cyber, anime, action..."
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!canSearch || isPending}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 px-6 text-xs font-semibold tracking-[0.18em] text-white transition hover:from-purple-600 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "SEARCHING..." : "SEARCH"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-5 max-w-2xl rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:ring-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-[0.2em] text-white/45">
                {item.kind.toUpperCase()}
                {item.year ? ` • ${item.year}` : ""}
              </div>
              {item.kind === "live" && (
                <span className="rounded-md bg-cyan-400 px-2 py-0.5 text-[10px] font-bold tracking-widest text-black">
                  LIVE
                </span>
              )}
            </div>
            <div className="mt-2 text-base font-semibold text-white/90">
              {item.title}
            </div>
            <Link
              href={`/watch/${item.id}`}
              className="mt-4 inline-flex text-sm text-teal-300 hover:underline"
            >
              Watch →
            </Link>
          </div>
        ))}
      </div>

      {results.length === 0 && query.trim().length > 0 && !isPending ? (
        <p className="mt-8 text-sm text-white/45">
          No results for &ldquo;{query}&rdquo;. Try a different query.
        </p>
      ) : null}

      {results.length === 0 && query.trim().length === 0 && (
        <div className="mt-8 text-center text-sm text-white/30">
          Type at least 2 characters and press Search.
        </div>
      )}
    </main>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <HomeHeader />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center text-sm text-white/40">
            Loading...
          </div>
        }
      >
        <ExploreInner />
      </Suspense>
    </div>
  );
}
