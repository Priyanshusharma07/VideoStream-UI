import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecommendedVideos, getVideoById } from "@/src/services/videoService";
import { VideoCard } from "@/src/components/videos/VideoCard";
import { VideoPlayback } from "@/src/components/videos/VideoPlayback";
import { VideoActions } from "@/src/components/videos/VideoActions";

export const dynamic = "force-dynamic";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) notFound();

  const recommended = await getRecommendedVideos(video, 6);

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
          <Link href="/qa" className="hover:text-white">
            QA
          </Link>
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-6 pb-14 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="overflow-hidden rounded-2xl bg-black/35 ring-1 ring-white/10">
            <div className="aspect-video w-full bg-black">
              <VideoPlayback src={video.videoUrl} poster={video.thumbnailUrl} />
            </div>
            <div className="space-y-3 p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                  {video.category}
                </span>
                {video.isPremium ? (
                  <span className="rounded-full bg-amber-400 px-3 py-1 font-extrabold tracking-[0.18em] text-black">
                    PREMIUM
                  </span>
                ) : null}
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                {video.title}
              </h1>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-white/55">{video.channelName}</div>
                <VideoActions videoId={video.id} title={video.title} />
              </div>

              <p className="text-sm leading-relaxed text-white/70">
                {video.description}
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-black/35 p-5 ring-1 ring-white/10 backdrop-blur">
            <div className="text-sm font-semibold text-white/85">Recommended</div>
            <div className="mt-4 grid gap-3">
              {recommended.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
