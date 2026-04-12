"use client";

import { useMemo } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { useWatchlist } from "@/src/hooks/useWatchlist";

type Props = {
  videoId: string;
  title: string;
};

export function VideoActions({ videoId, title }: Props) {
  const toast = useToast();
  const { inWatchlist, toggle } = useWatchlist(videoId);

  const label = useMemo(() => (inWatchlist ? "Saved" : "Save"), [inWatchlist]);

  function onToggle() {
    const nowSaved = toggle(videoId);
    toast.push({
      variant: "success",
      title: nowSaved ? "Saved to watchlist" : "Removed from watchlist",
      message: title,
    });
  }

  function onShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ url, title }).catch(() => null);
      return;
    }
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

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className={[
          "rounded-xl px-4 py-2 text-xs font-semibold ring-1 ring-white/10 transition",
          inWatchlist
            ? "bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25"
            : "bg-white/10 text-white/80 hover:bg-white/15",
        ].join(" ")}
      >
        {label}
      </button>
      <button
        type="button"
        onClick={onShare}
        className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
      >
        Share
      </button>
    </div>
  );
}

