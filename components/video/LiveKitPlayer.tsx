"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  token: any;
  url: string;
};

type Status = "connecting" | "connected" | "failed";

export function LiveKitPlayer({ token, url }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<any>(null);
  const [status, setStatus] = useState<Status>("connecting");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const tokenStr = typeof token === 'object' && token !== null
      ? (token as any)?.token ?? null
      : token;

    if (!tokenStr || typeof tokenStr !== 'string') {
      setStatus("failed");
      setErrorMsg("Invalid connection token received from server.");
      return;
    }

    let cancelled = false;

    async function connect() {
      try {
        const { Room, RoomEvent } = await import("livekit-client");
        const room = new Room();
        roomRef.current = room;

        const handleTrackSubscribed = (track: any) => {
          if (track.kind === "video" && videoRef.current) {
            track.attach(videoRef.current);
          }
          if (track.kind === "audio") {
            const el = document.createElement("audio");
            el.autoplay = true;
            track.attach(el);
          }
        };

        room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

        await room.connect(url, tokenStr);
        if (cancelled) return;

        setStatus("connected");

        // Handle already-published tracks
        room.remoteParticipants.forEach((p: any) => {
          p.trackPublications.forEach((pub: any) => {
            if (pub.track && pub.isSubscribed) handleTrackSubscribed(pub.track);
          });
        });
      } catch (err: any) {
        if (cancelled) return;
        console.error("LiveKitPlayer connect failed:", err.message);
        setStatus("failed");
        setErrorMsg(err.message);
      }
    }

    connect();

    return () => {
      cancelled = true;
      roomRef.current?.disconnect?.();
    };
  }, [token, url]);

  return (
    <div className="relative h-full w-full bg-black overflow-hidden rounded-[3rem] border border-white/10 flex items-center justify-center">
      
      {/* Video element always in DOM so ref is available */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`h-full w-full object-cover ${status === "connected" ? "block" : "hidden"}`}
      />

      {/* Connecting state */}
      {status === "connecting" && (
        <div className="flex flex-col items-center gap-4 text-white/60">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-primary" />
          <p className="text-xs font-bold uppercase tracking-widest">Connecting to stream…</p>
        </div>
      )}

      {/* Failed state */}
      {status === "failed" && (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-orange-400">signal_disconnected</span>
          <p className="text-white font-bold">Stream Unavailable</p>
          <p className="text-white/40 text-sm max-w-xs">
            The broadcaster's media server is not reachable. The stream may have ended or is not yet started.
          </p>
          <p className="text-white/20 text-xs font-mono break-all max-w-xs">{errorMsg}</p>
        </div>
      )}

      {/* LIVE badge */}
      {status === "connected" && (
        <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          Live
        </div>
      )}
    </div>
  );
}
