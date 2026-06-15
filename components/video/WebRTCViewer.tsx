"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Props = {
  roomId: string;
};

type Status = "waiting" | "connecting" | "live" | "ended";

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const SOCKET_URL = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'}/live`;

export function WebRTCViewer({ roomId }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [status, setStatus] = useState<Status>("waiting");

  useEffect(() => {
    let cancelled = false;

    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Viewer] Connected, joining room:', roomId);
      socket.emit('joinRoom', roomId);
      setStatus("connecting");
    });

    // Broadcaster is sending us an offer
    socket.on('webrtc-offer', async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      if (cancelled) return;
      console.log('[Viewer] Received offer from broadcaster:', from);

      const pc = new RTCPeerConnection(RTC_CONFIG);
      pcRef.current = pc;

      // When remote tracks arrive, show video
      pc.ontrack = (event) => {
        console.log('[Viewer] Track received:', event.track.kind);
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          setStatus("live");
        }
      };

      // Relay ICE candidates back to broadcaster
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc-ice', { targetId: from, candidate: event.candidate });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log('[Viewer] Peer state:', pc.connectionState);
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setStatus("ended");
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc-answer', { targetId: from, answer });
    });

    // Handle ICE from broadcaster
    socket.on('webrtc-ice', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (pcRef.current && pcRef.current.remoteDescription) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('broadcasterLeft', () => {
      if (cancelled) return;
      setStatus("ended");
    });

    return () => {
      cancelled = true;
      console.log('[Viewer] Leaving room and disconnecting:', roomId);
      socket.emit('leaveRoom', roomId);
      socket.disconnect();
      pcRef.current?.close();
    };
  }, [roomId]);

  return (
    <div className="relative h-full w-full bg-black overflow-hidden rounded-[3rem] border border-white/10 flex items-center justify-center">
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`h-full w-full object-cover ${status === "live" ? "block" : "hidden"}`}
      />

      {status === "waiting" && (
        <div className="flex flex-col items-center gap-4 text-white/60">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-primary" />
          <p className="text-xs font-bold uppercase tracking-widest">Waiting for broadcaster…</p>
        </div>
      )}

      {status === "connecting" && (
        <div className="flex flex-col items-center gap-4 text-white/60">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-secondary" />
          <p className="text-xs font-bold uppercase tracking-widest">Connecting to stream…</p>
        </div>
      )}

      {status === "ended" && (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-white/30">videocam_off</span>
          <p className="text-white font-bold">Stream Ended</p>
          <p className="text-white/40 text-sm">The broadcaster has ended this session.</p>
        </div>
      )}

      {status === "live" && (
        <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          Live
        </div>
      )}
    </div>
  );
}
