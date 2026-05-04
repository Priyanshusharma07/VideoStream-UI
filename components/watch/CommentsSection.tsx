"use client";

import { useState } from "react";
import { addVideoComment } from "@/services/videos-client";
import { useToast } from "@/components/ui/ToastProvider";

type Comment = {
  id: string;
  user: { name: string; avatarUrl?: string };
  message: string;
  createdAt: string;
};

export function CommentsSection({
  videoId,
  initialComments,
}: {
  videoId: string | number;
  initialComments: any[];
}) {
  const [comments, setComments] = useState<any[]>(initialComments);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();

  async function handlePost() {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    try {
      const vid = typeof videoId === "string" ? parseInt(videoId, 10) : videoId;
      const newComment = await addVideoComment(vid, trimmed);
      setComments((prev) => [newComment, ...prev]);
      setText("");
      toast.push({ variant: "success", title: "Comment Posted", message: "Your feedback has been added." });
    } catch (err) {
      toast.push({ variant: "error", title: "Error", message: "Failed to post comment." });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mt-12 glass-panel p-8 rounded-[2.5rem]">
      <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">forum</span>
        Discussion ({comments.length})
      </h3>

      {/* Post Box */}
      <div className="flex gap-4 mb-10">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 shrink-0">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div className="flex-1 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a cinematic review or comment..."
            rows={3}
            className="w-full bg-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 outline-none border border-white/5 focus:border-primary/40 focus:bg-white/10 transition-all resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handlePost}
              disabled={!text.trim() || isSending}
              className="px-8 py-2.5 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-30"
            >
              {isSending ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-8">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-[10px] font-black text-white/40 shrink-0">
              {(c.user?.name ?? "?")[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-white/90">{c.user?.name ?? "Anonymous"}</span>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Just now</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{c.message}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/20 font-bold italic">Be the first to share your thoughts on this production.</p>
          </div>
        )}
      </div>
    </div>
  );
}
