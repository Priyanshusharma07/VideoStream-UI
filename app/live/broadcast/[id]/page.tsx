"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { endLiveStream } from "@/services/videos-client";
import { ChatPanel } from "@/components/watch/ChatPanel";
import { useToast } from "@/components/ui/ToastProvider";
import { io, Socket } from "socket.io-client";

type Phase = "requesting-camera" | "camera-denied" | "live" | "error";

const SOCKET_URL = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'}/live`;

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function BroadcastPage() {
  const { id } = useParams();
  const roomId = String(id);

  const [phase, setPhase] = useState<Phase>("requesting-camera");
  const [viewerCount, setViewerCount] = useState(0);
  const [isEnding, setIsEnding] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  const router = useRouter();
  const toast = useToast();

  function createPeerForViewer(viewerId: string, socket: Socket, stream: MediaStream): RTCPeerConnection {
    const pc = new RTCPeerConnection(RTC_CONFIG);

    // Add all local tracks to this connection
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    // Relay ICE candidates to the viewer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-ice', { targetId: viewerId, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC] Peer ${viewerId} state: ${pc.connectionState}`);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        pc.close();
        peersRef.current.delete(viewerId);
      }
    };

    peersRef.current.set(viewerId, pc);
    return pc;
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // 1. Get camera/mic
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err: any) {
        if (cancelled) return;
        setPhase("camera-denied");
        return;
      }

      if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setPhase("live");

      // 2. Connect socket
      const socket = io(SOCKET_URL, { transports: ['websocket'] });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('[Socket] Connected as broadcaster:', socket.id);
        // Register as broadcaster for this room
        socket.emit('registerBroadcaster', roomId);
      });

      socket.on('viewerCount', (count: number) => setViewerCount(count));
      socket.on('connect_error', (err) => console.warn('[Socket] Error:', err.message));

      // 3. When a viewer joins, create an offer for them
      socket.on('viewerJoined', async ({ viewerId }: { viewerId: string }) => {
        if (cancelled || !streamRef.current) return;
        console.log('[WebRTC] Viewer joined, creating offer for:', viewerId);

        const pc = createPeerForViewer(viewerId, socket, streamRef.current);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc-offer', { targetId: viewerId, offer });
      });

      // 4. Handle answer from viewer
      socket.on('webrtc-answer', async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
        const pc = peersRef.current.get(from);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log('[WebRTC] Answer received from viewer:', from);
        }
      });

      // 5. Handle ICE from viewer
      socket.on('webrtc-ice', async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
        const pc = peersRef.current.get(from);
        if (pc && pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      toast.push({ variant: "success", title: "Live", message: "Camera ready. Viewers can now join!" });
    }

    init();

    return () => {
      cancelled = true;
      socketRef.current?.disconnect();
      streamRef.current?.getTracks().forEach(t => t.stop());
      peersRef.current.forEach(pc => pc.close());
      peersRef.current.clear();
    };
  }, [id]);

  useEffect(() => {
    if (phase === "live" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [phase]);

  async function handleEnd() {
    setIsEnding(true);
    try {
      await endLiveStream(id as string);
      socketRef.current?.disconnect();
      streamRef.current?.getTracks().forEach(t => t.stop());
      peersRef.current.forEach(pc => pc.close());
      toast.push({ variant: "info", title: "Live Ended", message: "Your broadcast has been archived." });
      router.push("/dashboard");
    } catch {
      toast.push({ variant: "error", title: "Error", message: "Failed to end stream." });
    } finally {
      setIsEnding(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] gap-6 p-6 overflow-hidden">
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative flex-1 bg-black rounded-[3rem] overflow-hidden border border-white/10 flex items-center justify-center">
          
          <video
            ref={videoRef}
            autoPlay muted playsInline
            className={`w-full h-full object-cover mirror ${phase === "live" ? "block" : "hidden"}`}
          />

          {phase !== "live" && (
            <div className="text-center p-12 absolute inset-0 flex flex-col items-center justify-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${
                phase === "camera-denied" ? "bg-red-500/10 text-red-400" : "bg-primary/10 text-primary animate-pulse"
              }`}>
                <span className="material-symbols-outlined text-4xl">
                  {phase === "camera-denied" ? "videocam_off" : "videocam"}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">
                {phase === "camera-denied" ? "Camera Access Denied" : "Requesting Camera…"}
              </h3>
              <p className="text-white/40 text-sm max-w-sm mx-auto mb-8">
                {phase === "camera-denied"
                  ? "Enable camera/mic in browser settings and retry."
                  : "Allow camera and microphone when your browser prompts you."}
              </p>
              {phase === "camera-denied" && (
                <button onClick={() => window.location.reload()}
                  className="px-8 py-3 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-primary transition-all">
                  Retry
                </button>
              )}
            </div>
          )}

          {phase === "live" && (
            <>
              <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Live
              </div>
              <div className="absolute bottom-8 left-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                <span className="material-symbols-outlined text-sm text-secondary">visibility</span>
                {viewerCount.toLocaleString()} watching
              </div>
            </>
          )}
        </div>

        <div className="glass-panel p-6 rounded-[2.5rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <div>
              <h2 className="text-white font-bold">Broadcasting Studio</h2>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-0.5">
                {phase === "live" ? "🔴 Live · WebRTC" : "⚪ Initializing"}
              </p>
            </div>
          </div>
          <button onClick={handleEnd} disabled={isEnding}
            className="px-10 py-4 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all disabled:opacity-40">
            {isEnding ? "Ending…" : "Stop Stream"}
          </button>
        </div>
      </div>

      <aside className="w-full lg:w-[400px] flex flex-col h-full">
        <div className="flex-1 glass-panel rounded-[3rem] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">forum</span>
            <h3 className="text-lg font-bold text-white">Live Discussion</h3>
          </div>
          <ChatPanel videoId={id as string} />
        </div>
      </aside>

      <style jsx>{`
        .mirror { transform: scaleX(-1); }
      `}</style>
    </div>
  );
}
