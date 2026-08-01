"use client";

import { useState } from "react";
import { joinRoom } from "@/services/room.service";
import { Loader2, X, DoorOpen } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (roomCode: string) => void;
};

export function JoinRoomModal({ isOpen, onClose, onSuccess }: Props) {
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!roomCode.trim()) return;

    setLoading(true);
    try {
      const code = roomCode.trim().toUpperCase();
      // First try to join to see if password is required or valid
      await joinRoom(code, password.trim() || undefined);
      toast.push({
        variant: "success",
        title: "Successfully Joined",
        message: `Redirecting to room ${code}`,
      });
      onSuccess(code);
    } catch (err: any) {
      toast.push({
        variant: "error",
        title: "Join Failed",
        message: err.message || "Failed to join room. Verify code/password.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
          <DoorOpen className="w-6 h-6 text-primary" /> Join Room
        </h3>
        <p className="text-sm text-white/40 mb-6">Enter details to connect to an existing room.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block">
              Room Code
            </label>
            <input
              type="text"
              required
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="e.g. RM-K8Q2PX"
              className="w-full h-12 rounded-xl bg-white/5 px-4 text-sm text-white border border-white/5 focus:border-primary/60 outline-none transition-all uppercase"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block">
              Room Password (if protected)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full h-12 rounded-xl bg-white/5 px-4 text-sm text-white border border-white/5 focus:border-primary/60 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
