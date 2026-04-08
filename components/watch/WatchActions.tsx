"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { postApi } from "@/services/api-client";

type Props = {
  videoId: string | number;
  creatorName: string;
  initialLikesLabel?: string;
};

export function WatchActions({ videoId, creatorName, initialLikesLabel }: Props) {
  const toast = useToast();
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesLabel, setLikesLabel] = useState(initialLikesLabel ?? "0");
  const [liking, setLiking] = useState(false);

  async function toggleLike() {
    if (liking) return;
    setLiking(true);
    const wasLiked = liked;
    setLiked(!wasLiked);

    try {
      const id = encodeURIComponent(String(videoId));
      const endpoint = wasLiked
        ? `/videos/${id}/unlike`
        : `/videos/${id}/like`;
      const res = await postApi<Record<string, never>, { likesLabel?: string }>(
        endpoint,
        {},
      );
      if (res.ok && res.data?.likesLabel) {
        setLikesLabel(res.data.likesLabel);
      }
      toast.push({
        variant: wasLiked ? "info" : "success",
        title: wasLiked ? "Removed like" : "Liked!",
        message: wasLiked ? "Like removed." : "Thanks for your support!",
      });
    } catch {
      // Rollback on error
      setLiked(wasLiked);
      toast.push({
        variant: "error" as never,
        title: "Error",
        message: "Could not update like. Try again.",
      });
    } finally {
      setLiking(false);
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ url, title: document.title }).catch(() => null);
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() =>
          toast.push({
            variant: "success",
            title: "Link copied!",
            message: "Share link copied to clipboard.",
          }),
        )
        .catch(() =>
          toast.push({
            variant: "info",
            title: "Share",
            message: url,
          }),
        );
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {/* Subscribe */}
      <button
        type="button"
        id="watch-subscribe-btn"
        onClick={() => {
          setSubscribed((v) => !v);
          toast.push({
            variant: "success",
            title: subscribed ? "Unsubscribed" : "Subscribed",
            message: creatorName,
          });
        }}
        className={[
          "rounded-xl px-4 py-2 text-xs font-semibold transition-all",
          subscribed
            ? "bg-white/10 text-white/85 ring-1 ring-white/10 hover:bg-white/15"
            : "bg-sky-500 text-black hover:bg-sky-400",
        ].join(" ")}
      >
        {subscribed ? "Subscribed ✓" : "Subscribe"}
      </button>

      {/* Like */}
      <button
        type="button"
        id="watch-like-btn"
        disabled={liking}
        onClick={toggleLike}
        className={[
          "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold ring-1 ring-white/10 transition-all",
          liked
            ? "bg-sky-500/20 text-sky-300 hover:bg-sky-500/30"
            : "bg-white/10 text-white/80 hover:bg-white/15",
        ].join(" ")}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
        </svg>
        {liked ? `Liked · ${likesLabel}` : `Like · ${likesLabel}`}
      </button>

      {/* Share */}
      <button
        type="button"
        id="watch-share-btn"
        onClick={handleShare}
        className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
      >
        Share
      </button>
    </div>
  );
}
