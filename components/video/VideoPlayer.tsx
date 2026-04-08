"use client";

import { useEffect, useRef, useState } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { pollVideoStatus } from "@/services/videos-client";

type Props = {
  videoId: string | number;
  initialStatus: string;
  initialHlsPath: string | null;
  apiBase: string;
  poster?: string | null;
  onFirstPlay?: () => void;
};

const POLL_INTERVAL_MS = 5_000; // every 5 seconds while processing
const MAX_POLLS = 60; // give up after 5 min

export function VideoPlayer({
  videoId,
  initialStatus,
  initialHlsPath,
  apiBase,
  poster,
  onFirstPlay,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [hlsPath, setHlsPath] = useState<string | null>(initialHlsPath);
  const pollCount = useRef(0);

  useEffect(() => {
    // Already ready — nothing to poll
    if (status === "ready" && hlsPath) return;
    // Terminal failures — stop
    if (status === "failed") return;

    const timer = setInterval(async () => {
      pollCount.current += 1;
      if (pollCount.current > MAX_POLLS) {
        clearInterval(timer);
        return;
      }

      const result = await pollVideoStatus(videoId);
      if (!result.ok) return;

      const { status: s, hlsManifestPath } = result.data;
      setStatus(s);
      if (hlsManifestPath) setHlsPath(hlsManifestPath);
      if (s === "ready" || s === "failed") clearInterval(timer);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hlsSrc = !hlsPath
    ? null
    : hlsPath.startsWith("http://") || hlsPath.startsWith("https://")
      ? hlsPath
      : `${apiBase.replace(/\/+$/, "")}${hlsPath}`;

  // ── Rendering ──────────────────────────────────────────────────────────────

  if (status === "failed") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-black/60 ring-1 ring-white/10">
        <svg
          className="h-10 w-10 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <p className="text-sm text-white/70">Video processing failed.</p>
      </div>
    );
  }

  if (!hlsSrc) {
    // Still processing: show animated waiting state
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl bg-black/60 ring-1 ring-white/10">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-sky-500/20" />
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-sky-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white/80">Processing video…</p>
          <p className="mt-1 text-xs text-white/40">
            This usually takes 1–3 minutes. The player will appear automatically.
          </p>
        </div>

        {/* Animated progress dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <HlsPlayer
      src={hlsSrc}
      poster={poster ?? undefined}
      autoPlay={false}
      onFirstPlay={onFirstPlay}
    />
  );
}
