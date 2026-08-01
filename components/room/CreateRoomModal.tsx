"use client";

import { useState } from "react";
import { createRoom } from "@/services/room.service";
import { Loader2, X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (roomCode: string) => void;
};

export function CreateRoomModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const room = await createRoom({
        name: name.trim(),
        password: password.trim() || undefined,
        maxParticipants,
      });
      toast.push({
        variant: "success",
        title: "Room Created",
        message: `Successfully created room "${room.name}"`,
      });
      onSuccess(room.roomCode);
    } catch (err: any) {
      toast.push({
        variant: "error",
        title: "Creation Failed",
        message: err.message || "Failed to create room.",
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
          <Plus className="w-6 h-6 text-primary" /> Create Room
        </h3>
        <p className="text-sm text-white/40 mb-6">Setup a new private streaming room.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block">
              Room Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Code Review"
              className="w-full h-12 rounded-xl bg-white/5 px-4 text-sm text-white border border-white/5 focus:border-primary/60 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block">
              Password (Optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty for public join"
              className="w-full h-12 rounded-xl bg-white/5 px-4 text-sm text-white border border-white/5 focus:border-primary/60 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block">
              Max Participants ({maxParticipants})
            </label>
            <input
              type="range"
              min="2"
              max="50"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
