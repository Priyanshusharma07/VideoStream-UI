"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  joinRoom,
  leaveRoom,
  endRoom,
  kickMember,
  getRoomMessages,
} from "@/services/room.service";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import { useRoomMedia } from "@/hooks/useRoomMedia";
import { ParticipantGrid } from "@/components/room/ParticipantGrid";
import { RoomControls } from "@/components/room/RoomControls";
import { RoomChat } from "@/components/room/RoomChat";
import { ParticipantList } from "@/components/room/ParticipantList";
import { useToast } from "@/components/ui/ToastProvider";
import { Loader2 } from "lucide-react";

type PageProps = {
  params: Promise<{
    roomCode: string;
  }>;
};

export default function RoomPage({ params }: PageProps) {
  const { roomCode } = use(params);
  const router = useRouter();
  const { getToken } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mediaConfig, setMediaConfig] = useState<{ url: string; token: string } | null>(null);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "participants" | null>("chat");

  const [isHandRaised, setIsHandRaised] = useState(false);

  // Initialize socket hook
  const {
    connected: socketConnected,
    messages,
    setMessages,
    participants,
    typingUsers,
    raisedHands,
    roomDetails,
    localUserId,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    raiseHand,
    lowerHand,
  } = useRoomSocket(roomCode);

  // Initialize WebRTC Media hook (only enabled once token is fetched)
  const {
    status: mediaStatus,
    errorMsg: mediaErrorMsg,
    isCameraEnabled,
    isMicrophoneEnabled,
    isScreenShareEnabled,
    tracks,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
  } = useRoomMedia({
    url: mediaConfig?.url || "",
    token: mediaConfig?.token || "",
    enabled: !!mediaConfig,
  });

  // 1. Join room via REST first to authenticate & fetch WebRTC token
  useEffect(() => {
    let active = true;

    async function initRoom() {
      try {
        const token = await getToken();
        if (!token) throw new Error("Not authenticated");

        // REST Join
        const joinData = await joinRoom(roomCode, undefined, token);
        if (!active) return;

        setMediaConfig(joinData.media);

        // Fetch past messages to prepopulate chat
        const pastMsgs = await getRoomMessages(roomCode, token);
        if (active) {
          setMessages(pastMsgs);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Failed to enter room.");
          toast.push({
            variant: "error",
            title: "Access Denied",
            message: err.message || "Cannot access this room.",
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initRoom();

    return () => {
      active = false;
    };
  }, [roomCode, getToken, setMessages, toast]);

  // Handle owner role status
  const isOwner = roomDetails?.role === "OWNER";

  // Actions
  async function handleLeave() {
    try {
      const token = await getToken();
      await leaveRoom(roomCode, token);
    } catch (e) {
      console.error(e);
    } finally {
      toast.push({
        variant: "info",
        title: "Session Left",
        message: "You have left the collaboration room.",
      });
      router.push("/rooms");
    }
  }

  async function handleEndRoom() {
    if (!confirm("Are you sure you want to end the room for everyone?")) return;
    try {
      const token = await getToken();
      await endRoom(roomCode, token);
      toast.push({
        variant: "success",
        title: "Room Ended",
        message: "The room has been closed successfully.",
      });
      router.push("/rooms");
    } catch (err: any) {
      toast.push({
        variant: "error",
        title: "Error Ending Room",
        message: err.message || "Could not end room.",
      });
    }
  }

  async function handleKick(userId: number) {
    if (!confirm("Kick this participant from the room?")) return;
    try {
      const token = await getToken();
      await kickMember(roomCode, userId, token);
      toast.push({
        variant: "success",
        title: "Participant Kicked",
        message: "User was removed from the session.",
      });
    } catch (err: any) {
      toast.push({
        variant: "error",
        title: "Failed to Kick",
        message: err.message || "Could not kick user.",
      });
    }
  }

  function handleToggleHand() {
    if (isHandRaised) {
      lowerHand();
      setIsHandRaised(false);
    } else {
      raiseHand();
      setIsHandRaised(true);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center gap-4 text-white/50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-black uppercase tracking-widest">Entering Room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider">Access Blocked</h2>
        <p className="text-white/40 text-sm max-w-sm">{error}</p>
        <button
          onClick={() => router.push("/rooms")}
          className="mt-4 h-12 px-6 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all"
        >
          Back to Setup
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col gap-6 max-w-[1700px] mx-auto">
      {/* Top Navigation / Info Header */}
      <div className="flex items-center justify-between bg-zinc-950/40 border border-white/5 px-8 py-5 rounded-[2rem] backdrop-blur-md">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">
            {roomDetails?.name || "Streaming Room"}
          </h2>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-wider mt-1">
            Room Code: <span className="text-primary font-black select-all">{roomCode}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Media: {mediaStatus === "connected" ? "Connected" : mediaStatus}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white/60 text-[10px] font-black uppercase tracking-wider">
            Socket: {socketConnected ? "Online" : "Connecting..."}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[60vh]">
        {/* Left Side: Participant Video Grid */}
        <div
          className={`flex flex-col gap-4 ${
            sidebarTab ? "lg:col-span-3" : "lg:col-span-4"
          } transition-all duration-300`}
        >
          <div className="flex-1 bg-zinc-900/20 border border-white/5 rounded-[3rem] p-6 flex items-center justify-center overflow-hidden">
            <ParticipantGrid
              participants={participants}
              tracks={tracks}
              raisedHands={raisedHands}
              localUserId={localUserId}
            />
          </div>
        </div>

        {/* Right Side: Sidebar (Chat or Participant list) */}
        {sidebarTab && (
          <div className="lg:col-span-1 flex flex-col gap-4 min-h-[400px]">
            {/* Sidebar Tab Selectors */}
            <div className="flex bg-zinc-950/40 p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setSidebarTab("chat")}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  sidebarTab === "chat" ? "bg-white text-black font-black" : "text-white/40 hover:text-white"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setSidebarTab("participants")}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  sidebarTab === "participants" ? "bg-white text-black font-black" : "text-white/40 hover:text-white"
                }`}
              >
                Members ({participants.length})
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 min-h-0">
              {sidebarTab === "chat" ? (
                <RoomChat
                  messages={messages}
                  typingUsers={typingUsers}
                  onSendMessage={sendMessage}
                  onTypingStart={sendTypingStart}
                  onTypingStop={sendTypingStop}
                  localUserId={localUserId}
                />
              ) : (
                <ParticipantList
                  participants={participants}
                  raisedHands={raisedHands}
                  isOwner={isOwner}
                  onKickMember={handleKick}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer controls bar */}
      <RoomControls
        isMuted={!isMicrophoneEnabled}
        isCamOff={!isCameraEnabled}
        isSharingScreen={isScreenShareEnabled}
        isHandRaised={isHandRaised}
        isChatOpen={!!sidebarTab}
        isOwner={isOwner}
        onToggleMic={toggleMicrophone}
        onToggleCam={toggleCamera}
        onToggleScreen={toggleScreenShare}
        onToggleHand={handleToggleHand}
        onToggleChat={() => setSidebarTab((prev) => (prev ? null : "chat"))}
        onLeave={handleLeave}
        onEndRoom={handleEndRoom}
      />
    </div>
  );
}
