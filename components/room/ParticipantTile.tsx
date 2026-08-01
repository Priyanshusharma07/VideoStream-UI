import { useEffect, useRef } from "react";
import { Mic, MicOff, User } from "lucide-react";

type Props = {
  name: string;
  isLocal: boolean;
  videoTrack?: any;
  micMuted?: boolean;
  isScreenShare?: boolean;
  handRaised?: boolean;
};

export function ParticipantTile({
  name,
  isLocal,
  videoTrack,
  micMuted = false,
  isScreenShare = false,
  handRaised = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (videoTrack && el) {
      videoTrack.attach(el);
      return () => {
        videoTrack.detach(el);
      };
    }
  }, [videoTrack]);

  return (
    <div className="relative aspect-[16/9] w-full bg-zinc-950 rounded-[2.5rem] border border-white/5 overflow-hidden flex items-center justify-center group shadow-2xl transition-all duration-300 hover:border-white/20">
      {videoTrack ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
            <User className="w-8 h-8 text-white/20 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{name}</span>
        </div>
      )}

      {/* Hand Raised overlay */}
      {handRaised && (
        <div className="absolute top-4 right-4 bg-amber-400 text-black px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 animate-bounce">
          <span>✋</span> Raised
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
          <span>{name}</span>
          {isLocal && <span className="text-primary font-black">(You)</span>}
          {isScreenShare && <span className="text-indigo-400 font-black">(Screen)</span>}
        </div>

        <div className="px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white flex items-center">
          {micMuted ? (
            <MicOff className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <Mic className="w-3.5 h-3.5 text-emerald-500" />
          )}
        </div>
      </div>
    </div>
  );
}
