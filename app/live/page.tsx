import Link from "next/link";
import { getLiveVideos } from "@/src/services/videoService";
import { VideoCard } from "@/components/video/VideoCard";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const live = await getLiveVideos();

  return (
    <div className="py-12 px-[5vw]">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
            Live Now
          </h1>
          <p className="mt-2 text-white/50 font-medium">
            Experience real-time cinematic moments from around the globe.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
          <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{live.length} ACTIVE STREAMS</span>
        </div>
      </div>

      {live.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-[2rem]">
          <span className="material-symbols-outlined text-4xl text-white/20 mb-4">videocam_off</span>
          <p className="text-white/40 font-bold">The stage is empty for now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {live.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}

