"use client";

import { BookmarkIcon } from "@/components/icons";
import { useToast } from "@/components/ui/ToastProvider";

export function RemoveFromWatchlistButton({ videoId }: { videoId: string }) {
  const toast = useToast();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toast.push({
          variant: "info",
          title: "Removed from watchlist",
          message: `Video: ${videoId}`,
        });
      }}
      className="shrink-0 rounded-xl bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10"
      aria-label="Remove from watchlist"
    >
      <BookmarkIcon className="h-4 w-4 text-sky-400" />
    </button>
  );
}

