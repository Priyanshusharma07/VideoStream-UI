"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Video } from "@/types/content";
import { VideoThumb } from "@/components/content/VideoThumb";

export function ForYouSection({
  filters,
  videos,
}: {
  filters: string[];
  videos: Video[];
}) {
  const [active, setActive] = useState(filters[0] ?? "All");

  const filtered = useMemo(() => {
    if (active === "All") return videos;
    return videos.filter((v) => v.category === active);
  }, [active, videos]);

  // Count per category for badge chips
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: videos.length };
    for (const v of videos) {
      map[v.category] = (map[v.category] ?? 0) + 1;
    }
    return map;
  }, [videos]);

  return (
    <section className="mt-10">
      {/* Header + filter chips */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white/90">For You</h2>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={[
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
                f === active
                  ? "bg-sky-500 text-black shadow-md shadow-sky-500/20"
                  : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {f}
              {counts[f] !== undefined && (
                <span
                  className={[
                    "rounded-full px-1.5 py-px text-[10px] font-bold",
                    f === active ? "bg-black/25 text-black/80" : "bg-white/10 text-white/50",
                  ].join(" ")}
                >
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => (
            <Link key={v.id} href={`/watch/${v.id}`} className="group">
              {/* Thumbnail */}
              <VideoThumb video={v} className="h-44" />

              {/* Meta row */}
              <div className="mt-3 flex items-start gap-3">
                {/* Creator avatar */}
                {v.creator.avatarUrl ? (
                  <Image
                    src={v.creator.avatarUrl}
                    alt={v.creator.name}
                    width={32}
                    height={32}
                    className="mt-0.5 h-8 w-8 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                    onError={() => { /* handled by VideoThumb gradient logic */ }}
                  />
                ) : (
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 text-xs font-bold text-white ring-1 ring-white/10">
                    {(v.creator.name ?? "?")[0].toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-sm font-semibold leading-snug text-white/90 group-hover:text-white transition-colors">
                    {v.title}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-white/50">
                    <span>{v.creator.name}</span>
                    <span>·</span>
                    <span>{v.viewsLabel}</span>
                    <span>·</span>
                    <span>{v.uploadedLabel}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-12 text-center">
          <svg className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
          </svg>
          <p className="text-sm text-white/40">No videos in <span className="text-white/60 font-medium">{active}</span> yet.</p>
        </div>
      )}
    </section>
  );
}
