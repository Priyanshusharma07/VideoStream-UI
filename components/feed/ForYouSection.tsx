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

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white/90">For You</h2>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                f === active
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((v) => (
          <Link key={v.id} href={`/watch/${v.id}`} className="group">
            <VideoThumb video={v} className="h-44" />
            <div className="mt-3 flex items-start gap-3">
              {v.creator.avatarUrl ? (
                <Image
                  src={v.creator.avatarUrl}
                  alt={v.creator.name}
                  width={32}
                  height={32}
                  className="mt-0.5 shrink-0 rounded-lg ring-1 ring-white/10"
                />
              ) : (
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 text-xs font-bold text-white ring-1 ring-white/10">
                  {(v.creator.name ?? "?")[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white/90 group-hover:text-white">
                  {v.title}
                </div>
                <div className="mt-1 text-xs text-white/55">
                  {v.creator.name} • {v.viewsLabel} • {v.uploadedLabel}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-white/45">No videos in this category.</p>
      ) : null}
    </section>
  );
}
