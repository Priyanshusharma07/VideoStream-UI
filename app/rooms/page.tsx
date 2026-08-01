"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateRoomModal } from "@/components/room/CreateRoomModal";
import { JoinRoomModal } from "@/components/room/JoinRoomModal";
import { Video, Users, Lock, Sparkles } from "lucide-react";

export default function RoomsSetupPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const router = useRouter();

  function handleRoomCreated(roomCode: string) {
    setCreateOpen(false);
    router.push(`/rooms/${roomCode}`);
  }

  function handleRoomJoined(roomCode: string) {
    setJoinOpen(false);
    router.push(`/rooms/${roomCode}`);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-zinc-950/40 border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl backdrop-blur-md text-center">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -z-10" />

        <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-8 shadow-[0_0_30px_rgba(179,197,255,0.25)]">
          <Video className="w-8 h-8" />
        </div>

        <h1 className="text-4xl font-black text-white tracking-tight mb-4 flex items-center justify-center gap-2">
          Collaboration Rooms <Sparkles className="w-5 h-5 text-amber-400" />
        </h1>
        <p className="text-sm text-white/40 font-medium max-w-md mx-auto mb-12">
          Connect, present, and chat in real-time with WebRTC audio/video rooms powered by LiveKit and Socket.IO.
        </p>

        {/* Features list */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-left">
            <Users className="w-5 h-5 text-primary mb-3" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Up to 50 Peers</h4>
            <p className="text-[10px] text-white/30">Connect mic, camera, and share screen in high quality.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-left">
            <Lock className="w-5 h-5 text-indigo-400 mb-3" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Secure Rooms</h4>
            <p className="text-[10px] text-white/30">Optionally protect room joining with password locks.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full sm:w-56 py-5 rounded-[2rem] bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl active:scale-[0.98]"
          >
            Create New Room
          </button>
          <button
            onClick={() => setJoinOpen(true)}
            className="w-full sm:w-56 py-5 rounded-[2rem] bg-white/5 text-white border border-white/5 font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
          >
            Join Existing Room
          </button>
        </div>

        <CreateRoomModal
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={handleRoomCreated}
        />

        <JoinRoomModal
          isOpen={joinOpen}
          onClose={() => setJoinOpen(false)}
          onSuccess={handleRoomJoined}
        />
      </div>
    </div>
  );
}
