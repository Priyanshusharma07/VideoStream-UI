"use client";

import { Participant } from "@/hooks/useRoomSocket";
import { User, Crown, Shield, Trash2, Hand } from "lucide-react";

type Props = {
  participants: Participant[];
  raisedHands: Set<number>;
  isOwner: boolean;
  onKickMember?: (userId: number) => void;
};

export function ParticipantList({
  participants,
  raisedHands,
  isOwner,
  onKickMember,
}: Props) {
  return (
    <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md p-6">
      <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-4 border-b border-white/5 pb-4">
        Participants ({participants.length})
      </h4>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {participants.map((p) => {
          const hasHandRaised = raisedHands.has(p.userId);
          return (
            <div
              key={p.userId}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative">
                  <User className="w-4 h-4 text-white/40" />
                  {p.role === "OWNER" && (
                    <Crown className="w-3.5 h-3.5 text-amber-400 absolute -top-1.5 -right-1.5 drop-shadow" />
                  )}
                  {p.role === "MODERATOR" && (
                    <Shield className="w-3.5 h-3.5 text-indigo-400 absolute -top-1.5 -right-1.5 drop-shadow" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white/80">{p.name}</div>
                  <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                    {p.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasHandRaised && (
                  <div className="px-2 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Hand className="w-3 h-3" /> Hand
                  </div>
                )}

                {isOwner && p.role !== "OWNER" && onKickMember && (
                  <button
                    onClick={() => onKickMember(p.userId)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/15 transition-all"
                    title="Kick Participant"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
