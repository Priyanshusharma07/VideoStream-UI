import Link from "next/link";
import { notFound } from "next/navigation";
import { AppTopbar } from "@/components/app/AppTopbar";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { ChatPanel } from "@/components/watch/ChatPanel";
import { WatchActions } from "@/components/watch/WatchActions";
import { VideoDescription } from "@/components/watch/VideoDescription";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { getVideoDetails } from "@/services/videos-client";

export const dynamic = "force-dynamic";

function apiBase() {
  const raw = process.env.NEXT_PUBLIC_API_BASE?.trim();
  return raw ? raw.replace(/\/+$/, "") : "";
}

export default async function VideoWatchPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Support both Next.js 14 (object) and 15 (Promise) params
  const resolvedParams = params instanceof Promise ? await params : params;
  const { id } = resolvedParams;
  if (!id) notFound();

  const result = await getVideoDetails(id);
  if (!result.ok) {
    if (result.error.code === "not_found") notFound();
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070A12] text-white">
        <div className="text-center">
          <p className="text-lg font-semibold text-white/80">
            Failed to load video
          </p>
          <p className="mt-1 text-sm text-white/45">{result.error.message}</p>
          <Link
            href="/feed"
            className="mt-4 inline-block rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-black"
          >
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  const { video: v, chat, playback } = result.data;
  const base = apiBase();

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 pt-6">
        <Link href="/" className="flex items-center gap-3">
          <StreamHubLogo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
          <Link href="/feed" className="hover:text-white transition-colors">Browse</Link>
          <Link href="/discover" className="hover:text-white transition-colors">Categories</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </nav>
        <div className="w-[520px] max-w-[50vw]">
          <AppTopbar placeholder="Search creators, games, videos..." />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1400px] gap-6 px-6 pb-14 pt-8 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="aspect-video w-full">
            <VideoPlayer
              videoId={id}
              initialStatus={playback.status}
              initialHlsPath={playback.hlsManifestPath ?? null}
              apiBase={base}
              poster={v.thumbnailUrl ?? undefined}
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight">{v.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span>{v.viewsLabel}</span>
            <span>•</span>
            <span>{v.uploadedLabel}</span>
            <span>•</span>
            <span>{v.category}</span>
            {v.durationLabel && (
              <>
                <span>•</span>
                <span>{v.durationLabel}</span>
              </>
            )}
          </div>

          {v.tags && v.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {v.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/65 ring-1 ring-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 text-sm font-bold text-white ring-1 ring-white/10">
                {(v.creator.name ?? "?")[0].toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-white/90">
                  {v.creator.name}
                </div>
                <div className="text-xs text-white/45">
                  {v.kind === "live" ? "Streaming live" : "Creator"}
                </div>
              </div>
            </div>

            <WatchActions
              videoId={id}
              creatorName={v.creator.name}
              initialLikesLabel={v.likesLabel}
            />
          </div>

          <VideoDescription text={v.description ?? ""} />
        </section>

        <div className="h-[calc(100vh-160px)] min-h-[560px]">
          <ChatPanel
            initialMessages={chat?.messages ?? []}
            viewersLabel={chat?.viewersLabel ?? ""}
          />
        </div>
      </main>
    </div>
  );
}
