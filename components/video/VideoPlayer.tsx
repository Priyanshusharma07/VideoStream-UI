"use client";

import { useEffect, useRef, useState } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { pollVideoStatus, submitViewerSignal } from "@/services/videos-client";

type Props = {
  videoId: string | number;
  initialStatus: string;
  initialHlsPath: string | null;
  apiBase: string;
  poster?: string | null;
  autoPlay?: boolean;
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
  autoPlay = true,
  onFirstPlay,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [hlsPath, setHlsPath] = useState<string | null>(initialHlsPath);
  const [useWebRTC, setUseWebRTC] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const pollCount = useRef(0);

  async function initWebRTC(signal: string) {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      const offer = JSON.parse(signal);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer back
      await submitViewerSignal(videoId, JSON.stringify(answer));
      setUseWebRTC(true);
    } catch (err) {
      console.error("WebRTC Connection failed:", err);
    }
  }

  useEffect(() => {
    // If it's live and has a signal, try WebRTC first for real camera feed
    // We check for broadcastSignal via a separate detail fetch if needed, 
    // but usually it's passed in playback info or video details.
    // For now, we'll assume it might come from the poll or initial details.
    
    // Already ready or live — nothing to poll
    if ((status === "ready" || status === "live") && hlsPath) return;
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

      const { status: s, hlsManifestPath, broadcastSignal } = result.data;
      
      if (s === "live" && broadcastSignal && !useWebRTC) {
        initWebRTC(broadcastSignal);
      }

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

  if (useWebRTC) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
          REAL-TIME FEED
        </div>
      </div>
    );
  }

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
      autoPlay={autoPlay}
      onFirstPlay={onFirstPlay}
    />
  );
}
