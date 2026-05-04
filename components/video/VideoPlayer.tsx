"use client";

import { useEffect, useRef, useState } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { WebRTCViewer } from "./WebRTCViewer";
import { pollVideoStatus } from "@/services/videos-client";

type Props = {
  videoId: string | number;
  initialStatus: string;
  initialHlsPath: string | null;
  apiBase: string;
  poster?: string | null;
  autoPlay?: boolean;
  onFirstPlay?: () => void;
};

const POLL_INTERVAL_MS = 5_000;
const MAX_POLLS = 60;

export function VideoPlayer({
  videoId,
  initialStatus,
  initialHlsPath,
  apiBase,
  poster,
  autoPlay = true,
  onFirstPlay,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [hlsPath, setHlsPath] = useState<string | null>(initialHlsPath);
  const pollCount = useRef(0);

  useEffect(() => {
    if (status === "ready" || status === "live" || status === "failed") return;

    const timer = setInterval(async () => {
      pollCount.current += 1;
      if (pollCount.current > MAX_POLLS) { clearInterval(timer); return; }

      const result = await pollVideoStatus(videoId);
      if (!result.ok) return;

      const { status: s, hlsManifestPath } = result.data;
      setStatus(s);
      if (hlsManifestPath) setHlsPath(hlsManifestPath);
      if (s === "ready" || s === "failed" || s === "live") clearInterval(timer);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [videoId, status]);

  // ── Live stream → WebRTC viewer ─────────────────────────────────────────────
  if (status === "live") {
    return <WebRTCViewer roomId={String(videoId)} />;
  }

  if (status === "failed") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-black/60 ring-1 ring-white/10">
        <span className="material-symbols-outlined text-4xl text-red-400">error</span>
        <p className="text-sm text-white/70">Video processing failed.</p>
      </div>
    );
  }

  const hlsSrc = !hlsPath
    ? null
    : hlsPath.startsWith("http://") || hlsPath.startsWith("https://")
      ? hlsPath
      : `${apiBase.replace(/\/+$/, "")}${hlsPath}`;

  if (!hlsSrc) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl bg-black/60 ring-1 ring-white/10">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-primary" />
        </div>
        <p className="text-sm font-semibold text-white/80">Processing video…</p>
      </div>
    );
  }

  return (
    <HlsPlayer
      src={hlsSrc}
      poster={poster ?? undefined}
      autoPlay={autoPlay}
      onFirstPlay={onFirstPlay}
    />
  );
}
