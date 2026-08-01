"use client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MessageSquare,
  Hand,
  LogOut,
  Settings,
  ShieldAlert,
} from "lucide-react";

type Props = {
  isMuted: boolean;
  isCamOff: boolean;
  isSharingScreen: boolean;
  isHandRaised: boolean;
  isChatOpen: boolean;
  isOwner: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreen: () => void;
  onToggleHand: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
  onEndRoom?: () => void;
};

export function RoomControls({
  isMuted,
  isCamOff,
  isSharingScreen,
  isHandRaised,
  isChatOpen,
  isOwner,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onToggleHand,
  onToggleChat,
  onLeave,
  onEndRoom,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950/60 border border-white/5 px-8 py-5 rounded-[2.5rem] backdrop-blur-md w-full shadow-2xl">
      {/* Left side actions (Mic & Camera) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMic}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isMuted
              ? "bg-red-500/10 text-red-500 border border-red-500/20"
              : "bg-white/5 text-white/80 border border-white/5 hover:bg-white/10"
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={onToggleCam}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isCamOff
              ? "bg-red-500/10 text-red-500 border border-red-500/20"
              : "bg-white/5 text-white/80 border border-white/5 hover:bg-white/10"
          }`}
        >
          {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>
      </div>

      {/* Center actions (Screen Share, Hand Raise, Chat Toggle) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleScreen}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${
            isSharingScreen
              ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(179,197,255,0.4)]"
              : "bg-white/5 text-white/80 border-white/5 hover:bg-white/10"
          }`}
          title="Share Screen"
        >
          <Monitor className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleHand}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${
            isHandRaised
              ? "bg-amber-400 text-black border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] animate-pulse"
              : "bg-white/5 text-white/80 border-white/5 hover:bg-white/10"
          }`}
          title="Raise Hand"
        >
          <Hand className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleChat}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${
            isChatOpen
              ? "bg-white text-black border-white"
              : "bg-white/5 text-white/80 border-white/5 hover:bg-white/10"
          }`}
          title="Toggle Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* Right side actions (Leave, End Room) */}
      <div className="flex items-center gap-3">
        {isOwner && onEndRoom && (
          <button
            onClick={onEndRoom}
            className="h-12 px-6 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-red-600/20 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" /> End Session
          </button>
        )}

        <button
          onClick={onLeave}
          className="h-12 px-6 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" /> Leave Room
        </button>
      </div>
    </div>
  );
}
