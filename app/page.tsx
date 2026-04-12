import Link from "next/link";
import { getVideos } from "@/src/services/videoService";
import { videoCategories } from "@/src/data/mockVideos";
import { VideoCard } from "@/src/components/videos/VideoCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-28 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-[-6rem] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-32 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-purple-600/12 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/60" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-sm font-extrabold tracking-[0.22em] text-white/90">
          STREAMHUB
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white/60">
          <Link href="/feed" className="hover:text-white">
            Feed
          </Link>
          <Link href="/live" className="hover:text-white">
            Live
          </Link>
          <Link href="/upload" className="hover:text-white">
            Upload
          </Link>
          <Link href="/login" className="hover:text-white">
            Login
          </Link>
          <Link href="/qa" className="hover:text-white">
            QA
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-14 pt-4">
        <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                Browse Videos
              </h1>
              <p className="mt-1 text-sm text-white/50">
                Demo-only content powered by a typed mock data layer (no backend).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/55">
              {videoCategories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
