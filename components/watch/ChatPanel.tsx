"use client";

import { useMemo, useState } from "react";

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

export function ChatPanel({
  initialMessages,
  viewersLabel,
}: {
  initialMessages: ChatMessage[];
  viewersLabel: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState("");

  const canSend = useMemo(() => text.trim().length > 0, [text]);

  function onSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${prev.length + 1}`,
        user: { name: "You" },
        message: trimmed,
      },
    ]);
  }

  return (
    <aside className="flex h-full flex-col rounded-2xl bg-black/35 ring-1 ring-white/10 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="text-xs font-semibold tracking-[0.22em] text-white/60">
          LIVE CHAT
        </div>
        <div className="text-xs text-emerald-300">{viewersLabel}</div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => {
          const badge = badgeLabel(m.user.badge);
          return (
            <div
              key={m.id}
              className={[
                "rounded-xl px-3 py-2 text-sm",
                m.highlighted
                  ? "bg-amber-400/10 ring-1 ring-amber-300/20"
                  : "bg-white/5 ring-1 ring-white/10",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/80">
                  {m.user.name}
                </span>
                {badge ? (
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-white/70">
                    {badge}
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-white/75">{m.message}</div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
            placeholder="Send a message..."
            className="w-full bg-transparent text-sm text-white/85 outline-none placeholder:text-white/35"
            aria-label="Chat message"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-[10px] text-white/30">Slow mode: On</div>
      </div>
    </aside>
  );
}
