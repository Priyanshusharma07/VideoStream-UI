"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addToWatchlist,
  getWatchlistIds,
  isInWatchlist,
  removeFromWatchlist,
  toggleWatchlist,
} from "@/src/services/watchlistService";

export function useWatchlist(videoId?: string) {
  const [ids, setIds] = useState<string[]>(() => getWatchlistIds());

  useEffect(() => {
    const onChange = () => setIds(getWatchlistIds());
    window.addEventListener("storage", onChange);
    window.addEventListener("streamhub:watchlist", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("streamhub:watchlist", onChange);
    };
  }, []);

  const inWatchlist = useMemo(() => {
    if (!videoId) return false;
    return ids.includes(videoId);
  }, [videoId, ids]);

  return {
    ids,
    inWatchlist,
    add: (id: string) => addToWatchlist(id),
    remove: (id: string) => removeFromWatchlist(id),
    toggle: (id: string) => toggleWatchlist(id),
    refresh: () => setIds(getWatchlistIds()),
  };
}

