"use client";

import Link from "next/link";
import Image from "next/image";
import type { Video } from "@/src/types/video";
import { formatViews, isLiveVideo } from "@/src/utils/video";

type Props = {
  video: Video;
};

export function VideoCard({ video }: Props) {
  const isLive = isLiveVideo(video);

  return (
    <Link
      href={`/video/${video.id}`}
      className="group block overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover opacity-95 transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white/90 ring-1 ring-white/10">
          {isLive ? "LIVE" : video.duration}
        </div>

        {isLive ? (
          <div className="absolute left-2 bottom-2 rounded-md bg-cyan-400 px-2 py-1 text-[10px] font-extrabold tracking-[0.18em] text-black">
            LIVE
          </div>
        ) : null}

        {video.isPremium ? (
          <div className="absolute left-2 top-2 rounded-md bg-amber-400 px-2 py-1 text-[10px] font-extrabold tracking-[0.18em] text-black">
            PREMIUM
          </div>
        ) : null}
      </div>

      <div className="space-y-1 px-4 py-3">
        <div className="line-clamp-2 text-sm font-semibold text-white/90">
          {video.title}
        </div>
        <div className="text-xs text-white/55">{video.channelName}</div>
        <div className="text-xs text-white/40">{formatViews(video.views)} views</div>
      </div>
    </Link>
  );
}
