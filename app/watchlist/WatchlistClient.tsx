"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";
import { useWatchlist } from "@/src/hooks/useWatchlist";
import type { Video } from "@/src/types/video";
import { getVideoById } from "@/src/services/videoService";
import { VideoCard } from "@/src/components/videos/VideoCard";

type Item = { id: string; video: Video | null };

export function WatchlistClient() {
  const toast = useToast();
  const { ids, remove } = useWatchlist();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const missing = useMemo(
    () => items.filter((x) => x.video === null).map((x) => x.id),
    [items],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const loaded = await Promise.all(
        ids.map(async (id): Promise<Item> => ({ id, video: await getVideoById(id) })),
      );
      if (cancelled) return;
      setItems(loaded);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  function removeId(id: string) {
    remove(id);
    toast.push({ variant: "info", title: "Removed from watchlist", message: id });
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/5 p-6 text-sm text-white/55 ring-1 ring-white/10">
        Loading watchlist...
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="text-sm font-semibold text-white/85">No saved videos</div>
        <div className="mt-1 text-sm text-white/55">
          Open a video and click Save to add it here.
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
        >
          Browse videos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {missing.length > 0 ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
          Some saved IDs are no longer in the demo dataset:{" "}
          <span className="font-mono text-amber-200">{missing.join(", ")}</span>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items
          .filter((x) => x.video !== null)
          .map((x) => (
            <div key={x.id} className="relative">
              <VideoCard video={x.video as Video} />
              <button
                type="button"
                onClick={() => removeId(x.id)}
                className="absolute right-3 top-3 rounded-xl bg-black/60 px-3 py-2 text-[10px] font-semibold text-white/85 ring-1 ring-white/10 hover:bg-black/75"
              >
                Remove
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

