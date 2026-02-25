"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const trimmed = useMemo(() => query.trim(), [query]);

  function goExplore() {
    if (trimmed.length > 0) {
      router.push(`/explore?q=${encodeURIComponent(trimmed)}`);
      return;
    }
    router.push("/explore");
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-black/35 p-2 ring-1 ring-white/10 backdrop-blur">
      <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
        <SearchIcon className="h-5 w-5 text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") goExplore();
          }}
          className="w-full bg-transparent text-sm text-white/85 outline-none placeholder:text-white/35"
          placeholder="Search movies, series, or genres..."
          aria-label="Search"
        />
      </div>

      <button
        type="button"
        onClick={goExplore}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 px-6 text-xs font-semibold tracking-[0.18em] text-white shadow-[0_10px_30px_rgba(99,102,241,0.25)] transition hover:from-purple-600 hover:to-indigo-500"
      >
        EXPLORE
      </button>
    </div>
  );
}

