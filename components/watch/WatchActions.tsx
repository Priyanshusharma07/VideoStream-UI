"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export function WatchActions({ creatorName }: { creatorName: string }) {
  const toast = useToast();
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => {
          setSubscribed((v) => !v);
          toast.push({
            variant: "success",
            title: subscribed ? "Unsubscribed" : "Subscribed",
            message: `${creatorName} (demo)`,
          });
        }}
        className={[
          "rounded-xl px-4 py-2 text-xs font-semibold transition",
          subscribed
            ? "bg-white/10 text-white/85 ring-1 ring-white/10 hover:bg-white/15"
            : "bg-sky-500 text-black hover:bg-sky-400",
        ].join(" ")}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>

      <button
        type="button"
        onClick={() => {
          setLiked((v) => !v);
          toast.push({
            variant: "info",
            title: liked ? "Removed like" : "Liked",
            message: "Saved in your activity (demo).",
          });
        }}
        className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
      >
        {liked ? "Liked" : "Like"}
      </button>

      <button
        type="button"
        onClick={() =>
          toast.push({
            variant: "info",
            title: "Share",
            message: "Share sheet coming soon (demo).",
          })
        }
        className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
      >
        Share
      </button>

      <button
        type="button"
        onClick={() =>
          toast.push({
            variant: "info",
            title: "Tip Creator",
            message: "Payments coming soon (demo).",
          })
        }
        className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
      >
        Tip Creator
      </button>
    </div>
  );
}

