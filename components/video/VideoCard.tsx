"use client";

import Link from "next/link";
import Image from "next/image";
import type { Video } from "@/types/content";

type Props = {
  video: Video;
};

export function VideoCard({ video }: Props) {
  const isLive = video.kind === "live" && video.status === "live";
  const duration = video.durationLabel || (video.kind === "live" ? "STREAM" : "");
  const views = video.viewsLabel || "0";
  const channelName = video.creator?.name || "Unknown";

  return (
    <Link
      href={`/watch/${video.id}`}
      className="group block glass-card rounded-[1.5rem] overflow-hidden"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={video.thumbnailUrl || "/demo/thumbs/thumb-01.svg"}
          alt={video.title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

        <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-white ring-1 ring-white/10">
          {isLive ? "LIVE" : duration}
        </div>

        {isLive && (
          <div className="absolute left-3 top-3 rounded-lg bg-secondary px-2.5 py-1 text-[10px] font-black tracking-widest text-white flex items-center gap-1.5 shadow-lg shadow-secondary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </div>
        )}

        {video.isPremium && !isLive && (
          <div className="absolute left-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-black tracking-widest text-black shadow-lg shadow-primary/20">
            PREMIUM
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="line-clamp-2 text-[15px] font-bold text-white leading-snug mb-2 group-hover:text-primary transition-colors">
          {video.title}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
            {channelName[0]}
          </div>
          <div>
            <div className="text-[12px] font-bold text-white/60">{channelName}</div>
            <div className="text-[11px] font-medium text-white/30">{views} views • {video.uploadedLabel}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
