"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/auth-session";
import { useRouter } from "next/navigation";

export type ChatMessage = {
  id: string;
  user: { name: string; badge?: "mod" | "creator" };
  message: string;
  highlighted?: boolean;
};

function badgeLabel(badge: ChatMessage["user"]["badge"]) {
  if (badge === "mod") return "MOD";
  if (badge === "creator") return "STREAMER";
  return null;
}

// ── Get current user's display name from auth session ───────────────────────
function getCurrentUserName(): string {
  if (typeof window === "undefined") return "Anonymous";
  try {
    const raw = window.localStorage.getItem("streamhub.auth");
    if (!raw) return "Viewer";
    const parsed = JSON.parse(raw);
    return parsed?.name || parsed?.email?.split("@")[0] || "Viewer";
  } catch {
    return "Viewer";
  }
}

const SOCKET_URL = `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"}/live`;

export function ChatPanel({
  videoId,
  initialMessages = [],
}: {
  videoId: string | number;
  initialMessages?: ChatMessage[];
  viewersLabel?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages ?? []);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const router = useRouter();

  const isLoggedIn = typeof window !== "undefined" && !!getAccessToken();
  const userName = getCurrentUserName();
  const canSend = useMemo(() => text.trim().length > 0 && isConnected, [text, isConnected]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Socket connection
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("joinRoom", String(videoId));
      console.log("[Chat] Joined room:", videoId);
    });

    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", () => setIsConnected(false));

    // Receive messages from ALL users in the room
    socket.on("newMessage", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("viewerCount", (count: number) => {
      setViewerCount(count);
    });

    return () => {
      socket.emit("leaveRoom", String(videoId));
      socket.disconnect();
    };
  }, [videoId]);

  async function onSend() {
    const trimmed = text.trim();
    if (!trimmed || isSending || !socketRef.current) return;

    if (!isLoggedIn) {
      toast.push({ variant: "error", title: "Login required", message: "Please log in to chat." });
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }

    setIsSending(true);
    try {
      // Emit to socket — server will broadcast to all users in room including sender
      socketRef.current.emit("sendMessage", {
        roomId: String(videoId),
        message: trimmed,
        user: { name: userName },
      });
      setText("");
    } catch {
      toast.push({ variant: "error", title: "Chat Error", message: "Failed to send message." });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <aside className="flex h-full flex-col rounded-2xl bg-black/35 ring-1 ring-white/10 backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
          <div className="text-xs font-semibold tracking-[0.22em] text-white/60">LIVE CHAT</div>
        </div>
        <div className="text-xs text-emerald-300 font-bold">
          {viewerCount.toLocaleString()} watching
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-white/20">
            <span className="material-symbols-outlined text-3xl">forum</span>
            <p className="text-xs">Be the first to chat!</p>
          </div>
        )}
        {messages.map((m, idx) => {
          const badge = badgeLabel(m.user?.badge);
          const isOwn = m.user?.name === userName && isLoggedIn;
          return (
            <div
              key={`${m.id}-${idx}`}
              className={[
                "rounded-xl px-3 py-2 text-sm transition-all",
                isOwn
                  ? "bg-primary/10 ring-1 ring-primary/30 ml-4"
                  : m.highlighted
                    ? "bg-amber-400/10 ring-1 ring-amber-300/20"
                    : "bg-white/5 ring-1 ring-white/10",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${isOwn ? "text-primary" : "text-white/80"}`}>
                  {isOwn ? "You" : (m.user?.name ?? "Anonymous")}
                </span>
                {badge && (
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-white/70">
                    {badge}
                  </span>
                )}
              </div>
              <div className="mt-1 text-white/75">{m.message}</div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-3">
        {isLoggedIn ? (
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 focus-within:ring-primary/40 transition-all">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
              placeholder={isConnected ? `Chat as ${userName}…` : "Connecting…"}
              disabled={!isConnected}
              className="w-full bg-transparent text-sm text-white/85 outline-none placeholder:text-white/35 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={onSend}
              disabled={!canSend || isSending}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-black text-black disabled:cursor-not-allowed disabled:opacity-40 transition-all hover:brightness-110"
            >
              {isSending ? "…" : "Send"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push(`/login?redirect=${typeof window !== "undefined" ? window.location.pathname : ""}`)}
            className="w-full py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
          >
            Log in to Chat
          </button>
        )}
      </div>
    </aside>
  );
}
