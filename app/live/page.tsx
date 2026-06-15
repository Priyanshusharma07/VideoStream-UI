"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getLiveVideos } from "@/services/videos-client";
import { VideoCard } from "@/components/video/VideoCard";

const POLL_INTERVAL_MS = 15_000; // re-fetch active streams every 15 seconds

export default function LivePage() {
  const [lives, setLives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchLives = useCallback(async () => {
    const res = await getLiveVideos();
    if (res.ok) {
      setLives(res.data);
      setLastRefreshed(new Date());
    }
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLives();
  }, [fetchLives]);

  // Poll for new / ended streams every POLL_INTERVAL_MS
  useEffect(() => {
    const timer = setInterval(() => {
      fetchLives();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchLives]);

  return (
    <div className="py-12 px-6 lg:px-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Live Now</h1>
          <p className="text-white/40 font-medium flex items-center gap-2">
            Join real-time cinematic events across the globe.
            {lastRefreshed && (
              <span className="text-white/20 text-xs">
                · Updated {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setLoading(true); fetchLives(); }}
            className="p-3 rounded-2xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all border border-white/5"
            title="Refresh"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
          <Link
            href="/live/setup"
            className="px-8 py-3 rounded-2xl bg-primary text-black font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            Go Live
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-video rounded-[2rem] bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : lives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {lives.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-[3rem] border border-white/5">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">sensors_off</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">No active broadcasts</h2>
          <p className="text-white/40 max-w-sm mx-auto mb-8">It's a quiet moment in the studio. Why not start your own cinematic journey?</p>
          <Link
            href="/live/setup"
            className="inline-block px-10 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all"
          >
            Start First Stream
          </Link>
        </div>
      )}
    </div>
  );
}
