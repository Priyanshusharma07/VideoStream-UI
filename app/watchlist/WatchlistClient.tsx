"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";
import { useWatchlist } from "@/src/hooks/useWatchlist";
import type { Video } from "@/src/types/video";
import { getVideoById } from "@/src/services/videoService";
import { VideoCard } from "@/components/video/VideoCard";

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
      <div className="flex justify-center py-24">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="text-center py-24 glass-panel rounded-[2rem]">
        <span className="material-symbols-outlined text-4xl text-white/20 mb-4">bookmark_outline</span>
        <p className="text-white/40 font-bold mb-6">Your watchlist is empty.</p>
        <Link
          href="/"
          className="inline-flex rounded-2xl bg-primary px-8 py-3 font-black text-black hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
        >
          Discover Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {missing.length > 0 && (
        <div className="rounded-2xl border border-secondary/20 bg-secondary/10 px-6 py-4 text-sm font-bold text-secondary">
          Notice: Some saved titles are currently unavailable in the vault.
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items
          .filter((x) => x.video !== null)
          .map((x) => (
            <div key={x.id} className="relative group">
              <VideoCard video={x.video as Video} />
              <button
                type="button"
                onClick={() => removeId(x.id)}
                className="absolute right-4 top-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl bg-black/60 backdrop-blur-md px-3 py-2 text-[10px] font-black text-white ring-1 ring-white/10 hover:bg-red-500 hover:ring-red-400"
              >
                REMOVE
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}


