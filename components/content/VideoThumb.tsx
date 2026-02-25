"use client";

import Image from "next/image";
import { PlayIcon } from "@/components/icons";
import type { Video } from "@/lib/contracts/content";

export function VideoThumb({
  video,
  className,
}: {
  video: Pick<Video, "thumbnailUrl" | "title" | "kind" | "durationLabel">;
  className?: string;
}) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10",
        className ?? "",
      ].join(" ")}
    >
      <Image
        src={video.thumbnailUrl}
        alt={video.title}
        width={960}
        height={540}
        className="h-full w-full object-cover opacity-95 transition group-hover:opacity-100"
        priority={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/0" />

      <div className="absolute left-3 top-3">
        {video.kind === "live" ? (
          <span className="rounded-md bg-cyan-400 px-2 py-1 text-[10px] font-bold tracking-[0.18em] text-black">
            LIVE
          </span>
        ) : null}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white/80 ring-1 ring-white/15 backdrop-blur transition group-hover:bg-black/50">
          <PlayIcon className="h-6 w-6 translate-x-[1px]" />
        </span>
      </div>

      {video.durationLabel ? (
        <div className="absolute bottom-3 right-3 rounded-lg bg-black/45 px-2 py-1 text-[10px] font-semibold text-white/80 ring-1 ring-white/10">
          {video.durationLabel}
        </div>
      ) : null}
    </div>
  );
}
