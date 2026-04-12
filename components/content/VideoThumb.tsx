"use client";

import Image from "next/image";
import { PlayIcon } from "@/components/icons";
import type { Video } from "@/types/content";
import { useState } from "react";

// Gradient fallback palettes — cycle by title hash
const GRADIENTS = [
  "from-sky-600 to-violet-700",
  "from-emerald-500 to-cyan-600",
  "from-pink-600 to-rose-700",
  "from-orange-500 to-amber-600",
  "from-indigo-600 to-purple-700",
  "from-teal-500 to-emerald-600",
];

function gradientFor(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) & 0xffff;
  return GRADIENTS[hash % GRADIENTS.length];
}

function isValidSrc(src: string | null | undefined): src is string {
  if (!src || typeof src !== "string") return false;
  const t = src.trim();
  return t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/");
}

export function VideoThumb({
  video,
  className,
}: {
  video: Pick<Video, "thumbnailUrl" | "title" | "kind" | "durationLabel">;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const hasThumbnail = isValidSrc(video.thumbnailUrl) && !imgError;
  const gradient = gradientFor(video.title);

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10",
        className ?? "",
      ].join(" ")}
    >
      {/* Thumbnail or gradient fallback */}
      {hasThumbnail ? (
        <Image
          src={video.thumbnailUrl!}
          alt={video.title}
          width={960}
          height={540}
          className="h-full w-full object-cover opacity-95 transition group-hover:opacity-100"
          priority={false}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`h-full w-full bg-gradient-to-br ${gradient} flex items-end p-3 transition group-hover:brightness-110`}
        >
          <span className="line-clamp-2 text-xs font-semibold text-white/70">
            {video.title}
          </span>
        </div>
      )}

      {/* Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/0" />

      {/* LIVE badge */}
      <div className="absolute left-3 top-3">
        {video.kind === "live" ? (
          <span className="flex items-center gap-1.5 rounded-md bg-rose-500 px-2 py-1 text-[10px] font-bold tracking-[0.18em] text-white shadow-lg">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            LIVE
          </span>
        ) : null}
      </div>

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-white/90 ring-1 ring-white/20 backdrop-blur transition group-hover:scale-105">
          <PlayIcon className="h-6 w-6 translate-x-[1px]" />
        </span>
      </div>

      {/* Duration */}
      {video.durationLabel ? (
        <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-semibold text-white/90 ring-1 ring-white/10 backdrop-blur">
          {video.durationLabel}
        </div>
      ) : null}
    </div>
  );
}
