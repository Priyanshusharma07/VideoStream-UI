import Link from "next/link";
import { getLiveVideos } from "@/src/services/videoService";
import { VideoCard } from "@/src/components/videos/VideoCard";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const live = await getLiveVideos();

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-sm font-extrabold tracking-[0.22em] text-white/90">
          STREAMHUB
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white/60">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <Link href="/feed" className="hover:text-white">
            Feed
          </Link>
          <Link href="/live" className="text-white/90">
            Live
          </Link>
          <Link href="/qa" className="hover:text-white">
            QA
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-14 pt-2">
        <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white/90">
              Live Now
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Demo live streams backed by public HLS URLs.
            </p>
          </div>

          {live.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-white/5 p-6 text-sm text-white/60 ring-1 ring-white/10">
              No live streams right now.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
