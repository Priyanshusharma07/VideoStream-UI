import type { Video } from "@/src/types/video";

export function isHlsUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.endsWith(".m3u8") || trimmed.includes(".m3u8?");
}

export function isLiveVideo(video: Video | any): boolean {
  if (!video) return false;
  const url = video.videoUrl || "";
  const duration = (video.duration || video.durationLabel || "").trim().toUpperCase();
  return isHlsUrl(url) || duration === "LIVE";
}


export function formatViews(views: number): string {
  if (!Number.isFinite(views) || views < 0) return "0";
  if (views >= 1_000_000_000)
    return `${(views / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  if (views >= 1_000_000)
    return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (views >= 1_000)
    return `${(views / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(Math.floor(views));
}

