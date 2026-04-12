"use client";

import { HlsPlayer } from "@/components/video/HlsPlayer";
import { isHlsUrl } from "@/src/utils/video";

type Props = {
  src: string;
  poster?: string;
  autoPlay?: boolean;
};

export function VideoPlayback({ src, poster, autoPlay = false }: Props) {
  const url = src.trim();
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/60 ring-1 ring-white/10">
        <p className="text-sm text-white/60">Missing video URL.</p>
      </div>
    );
  }

  if (isHlsUrl(url)) {
    return <HlsPlayer src={url} poster={poster} autoPlay={autoPlay} />;
  }

  return (
    <video
      controls
      preload="metadata"
      src={url}
      poster={poster}
      className="h-full w-full object-contain"
    />
  );
}
