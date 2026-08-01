"use client";

import { useEffect, useRef, useState } from "react";
import { MessagePayload } from "@/hooks/useRoomSocket";
import { Send, User } from "lucide-react";

type Props = {
  messages: MessagePayload[];
  typingUsers: Record<number, string>;
  onSendMessage: (msg: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  localUserId?: number;
};

export function RoomChat({
  messages,
  typingUsers,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  localUserId,
}: Props) {
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom of chat list
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    onSendMessage(text.trim());
    setText("");

    // Trigger immediate typing stop
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onTypingStop();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);

    // Broadcast typing start
    onTypingStart();

    // Debounce typing stop
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 2000);
  }

  // Format typing indicators string
  const typingList = Object.values(typingUsers);
  const typingText =
    typingList.length === 1
      ? `${typingList[0]} is typing...`
      : typingList.length > 1
      ? `${typingList.slice(0, 2).join(", ")}${
          typingList.length > 2 ? " and others" : ""
        } are typing...`
      : "";

  return (
    <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5">
        <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Room Chat</h4>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-xs text-white/20 font-medium">
            No messages yet.<br />Say hello to start the discussion!
          </div>
        ) : (
          messages.map((msg) => {
            const isLocal = msg.senderId === localUserId;
            return (
              <div
                key={msg.id || msg.clientMessageId}
                className={`flex gap-3 max-w-[85%] ${isLocal ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white/30" />
                </div>
                <div className="space-y-1">
                  <div
                    className={`text-[9px] font-black uppercase tracking-wider text-white/30 ${
                      isLocal ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.sender?.name || "Participant"}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs leading-relaxed text-white font-medium ${
                      isLocal
                        ? "bg-primary text-black rounded-tr-none"
                        : "bg-white/5 border border-white/5 rounded-tl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Typing indicator */}
      {typingText && (
        <div className="px-6 py-1 text-[9px] font-black text-primary/60 uppercase tracking-widest animate-pulse">
          {typingText}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-6 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Send a message..."
          className="flex-1 h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-xs text-white placeholder:text-white/20 outline-none focus:border-primary/60 transition-all"
        />
        <button
          type="submit"
          className="w-12 h-12 rounded-xl bg-white text-black hover:bg-primary transition-all flex items-center justify-center shrink-0 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
