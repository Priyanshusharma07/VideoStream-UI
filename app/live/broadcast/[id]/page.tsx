"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { endLiveStream, updateLiveSignal } from "@/services/videos-client";
import { getApi } from "@/services/api-client";
import { ChatPanel } from "@/components/watch/ChatPanel";
import { useToast } from "@/components/ui/ToastProvider";

export default function BroadcastPage() {
  const { id } = useParams();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<"pending" | "granted" | "denied">("pending");

  // Callback ref to attach stream immediately when element mounts
  const videoRef = (el: HTMLVideoElement | null) => {
    if (el && stream) {
      el.srcObject = stream;
    }
  };
  const [isEnding, setIsEnding] = useState(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const router = useRouter();
  const toast = useToast();

  async function startBroadcasting(stream: MediaStream) {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });
      pcRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Save offer to backend
      await updateLiveSignal(id as string, JSON.stringify(offer));

      // Poll for viewer answer
      const poll = setInterval(async () => {
        const { data } = await getApi<any>(`/videos/${id}`);
        if (data.video?.viewerSignal) {
          const answer = JSON.parse(data.video.viewerSignal);
          if (pc.signalingState !== "stable") {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            clearInterval(poll);
            toast.push({ variant: "success", title: "Viewer Connected", message: "Real-time feed established." });
          }
        }
      }, 3000);

      return () => clearInterval(poll);
    } catch (err) {
      console.error("Broadcasting failed:", err);
    }
  }

  async function startCamera() {
    try {
      setPermissionState("pending");

      if (!window.isSecureContext) {
        throw new Error("SECURE_CONTEXT_REQUIRED");
      }

      let s: MediaStream;
      try {
        // Try for both first
        s = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
          audio: true 
        });
      } catch (e) {
        console.warn("Dual stream failed, trying video only...", e);
        // Fallback to video only if audio is busy/unavailable
        s = await navigator.mediaDevices.getUserMedia({ video: true });
        toast.push({ variant: "info", title: "Audio Unavailable", message: "Broadcasting without microphone." });
      }

      setStream(s);
      setPermissionState("granted");
      toast.push({ variant: "success", title: "Media Connected", message: "Camera is live." });
      
      // Start WebRTC broadcasting
      startBroadcasting(s);
    } catch (err: any) {
      setPermissionState("denied");
      let msg = "Could not access camera or microphone.";
      
      if (err.message === "SECURE_CONTEXT_REQUIRED") {
        msg = "Camera requires HTTPS or Localhost. Please check your browser's security bar.";
      } else if (err.name === "NotAllowedError") {
        msg = "Camera permission was blocked. Please enable it in your browser settings.";
      } else if (err.name === "NotFoundError") {
        msg = "No camera or microphone found on this device.";
      }

      toast.push({ variant: "error", title: "Camera Error", message: msg });
    }
  }

  useEffect(() => {
    startCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  async function handleEnd() {
    setIsEnding(true);
    try {
      await endLiveStream(id as string);
      
      // STOP CAMERA TRACKS
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      // Close P2P connection
      pcRef.current?.close();

      toast.push({ variant: "info", title: "Live Ended", message: "Your broadcast has been archived." });
      router.push("/dashboard");
    } catch (err) {
      toast.push({ variant: "error", title: "Error", message: "Failed to end stream properly." });
    } finally {
      setIsEnding(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] gap-6 p-6 overflow-hidden">
      {/* Broadcaster View */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative flex-1 bg-black rounded-[3rem] overflow-hidden border border-white/10 group flex items-center justify-center">
          {permissionState === "granted" ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover mirror"
            />
          ) : (
            <div className="text-center p-12">
               <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${permissionState === 'denied' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary animate-pulse'}`}>
                  <span className="material-symbols-outlined text-4xl">
                    {permissionState === 'denied' ? 'videocam_off' : 'videocam'}
                  </span>
               </div>
               <h3 className="text-xl font-black text-white mb-2">
                 {permissionState === 'denied' ? 'Camera Access Denied' : 'Awaiting Permission'}
               </h3>
               <p className="text-white/40 text-sm max-w-xs mx-auto mb-8 font-medium">
                 {permissionState === 'denied' 
                   ? 'Please enable camera and microphone access in your browser settings to start the cinematic broadcast.' 
                   : 'Please allow camera and microphone access when prompted by your browser.'}
               </p>
               {permissionState === 'denied' && (
                 <button 
                   onClick={startCamera}
                   className="px-8 py-3 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-primary transition-all"
                 >
                   Retry Connection
                 </button>
               )}
            </div>
          )}
          
          {/* Overlay UI */}
          <div className="absolute top-8 left-8 flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                Live
             </div>
             <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                00:12:45
             </div>
          </div>

          <div className="absolute bottom-8 left-8 flex items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                <span className="material-symbols-outlined text-sm text-secondary">visibility</span>
                1,240
             </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="glass-panel p-6 rounded-[2.5rem] flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                 <span className="material-symbols-outlined">settings</span>
              </div>
              <div>
                 <h2 className="text-white font-bold">Broadcasting Assets</h2>
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-0.5">1080p • 60fps • 4500kbps</p>
              </div>
           </div>
           <button 
             onClick={handleEnd}
             disabled={isEnding}
             className="px-10 py-4 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-xl"
           >
             {isEnding ? "Ending..." : "Stop Stream"}
           </button>
        </div>
      </div>

      {/* Live Chat Panel */}
      <aside className="w-full lg:w-[400px] flex flex-col h-full bg-transparent">
        <div className="flex-1 glass-panel rounded-[3rem] overflow-hidden flex flex-col">
           <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">forum</span>
                Live Discussion
              </h3>
           </div>
           <ChatPanel videoId={id as string} viewersLabel="1,240" />
        </div>
      </aside>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
