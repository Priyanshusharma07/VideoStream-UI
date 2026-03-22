import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppTopbar } from "@/components/app/AppTopbar";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { ChatPanel, type ChatMessage } from "@/components/watch/ChatPanel";
import { WatchActions } from "@/components/watch/WatchActions";
import { VideoDescription } from "@/components/watch/VideoDescription";
import { HlsPlayer } from "@/components/video/HlsPlayer";

export const dynamic = "force-dynamic";

type VideoStatus = "ready" | "processing";

type VideoDetailResponse = {
  video: {
    id: number;
    title: string;
    description: string;
    tags: string[];
    thumbnailUrl: string | null;
    durationLabel?: string;
    kind: "video" | "live";
    category: string;
    creator: { id: number; name: string; avatarUrl: string | null };
    viewsLabel: string;
    uploadedLabel: string;
    likesLabel: string;
    status: VideoStatus;
  };
  chat: {
    viewersLabel: string;
    messages: ChatMessage[];
  };
  playback: {
    hlsManifestPath?: string | null;
    status: VideoStatus;
  };
};

function backendBase() {
  const raw = process.env.NEXT_PUBLIC_API_BASE?.trim();
  return raw ? raw.replace(/\/+$/, "") : "https://api.yourdomain.com";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

export default async function VideoWatchPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { id } = params;
  const processing = searchParams?.processing;
  const showProcessingBanner =
    processing === "1" || (Array.isArray(processing) && processing[0] === "1");

  const base = backendBase();
  const res = await fetch(`${base}/videos/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (res.status === 404) return notFound();
  if (!res.ok) {
    throw new Error(`Failed to load video (HTTP ${res.status}).`);
  }

  const raw = (await res.json().catch(() => null)) as unknown;
  const json =
    isRecord(raw) && typeof raw.ok === "boolean" && raw.ok
      ? (raw.data as VideoDetailResponse)
      : (raw as VideoDetailResponse);
  if (!json?.video) throw new Error("Bad response from backend.");

  const v = json.video;
  const manifestPath =
    typeof json.playback?.hlsManifestPath === "string"
      ? json.playback.hlsManifestPath
      : null;
  const playbackReady = json.playback?.status === "ready" && Boolean(manifestPath);
  const manifestUrl =
    playbackReady && manifestPath
      ? `${base}${manifestPath.startsWith("/") ? "" : "/"}${manifestPath}`
      : null;

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 pt-6">
        <Link href="/" className="flex items-center gap-3">
          <StreamHubLogo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
          <Link href="/feed" className="hover:text-white">
            Browse
          </Link>
          <Link href="/discover" className="hover:text-white">
            Categories
          </Link>
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
        </nav>
        <div className="w-[520px] max-w-[50vw]">
          <AppTopbar
            placeholder="Search creators, games, videos..."
            rightSlot={
              <Image
                src="/demo/avatars/avatar-03.svg"
                alt="Profile"
                width={36}
                height={36}
                className="rounded-xl ring-1 ring-white/10"
              />
            }
          />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1400px] gap-6 px-6 pb-14 pt-8 lg:grid-cols-[1fr_360px]">
        <section>
          {showProcessingBanner ? (
            <div className="mb-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
              Your video is processing. Playback will appear here once it&apos;s ready.
            </div>
          ) : null}

          <div className="aspect-video">
            {v.status === "ready" && manifestUrl ? (
              <HlsPlayer src={manifestUrl} poster={v.thumbnailUrl ?? undefined} />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/35 ring-1 ring-white/10 backdrop-blur">
                <div className="text-sm text-white/70">
                  Video is still processing, check back soon.
                </div>
              </div>
            )}
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight">{v.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span>{v.viewsLabel}</span>
            <span>•</span>
            <span>{v.uploadedLabel}</span>
            <span>•</span>
            <span>{v.category}</span>
            <span>•</span>
            <span>{v.likesLabel}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {Array.isArray(v.tags)
              ? v.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/65 ring-1 ring-white/10"
                  >
                    {t}
                  </span>
                ))
              : null}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <Image
                src={v.creator.avatarUrl ?? "/demo/avatars/avatar-02.svg"}
                alt={v.creator.name}
                width={44}
                height={44}
                className="rounded-xl ring-1 ring-white/10"
              />
              <div>
                <div className="text-sm font-semibold text-white/90">
                  {v.creator.name}
                </div>
                <div className="text-xs text-white/45">
                  {v.kind === "live" ? "Live streaming" : "New upload"}
                </div>
              </div>
            </div>

            <WatchActions creatorName={v.creator.name} />
          </div>

          <VideoDescription text={v.description ?? ""} />
        </section>

        <div className="h-[calc(100vh-160px)] min-h-[560px]">
          <ChatPanel
            initialMessages={json.chat?.messages ?? []}
            viewersLabel={json.chat?.viewersLabel ?? ""}
          />
        </div>
      </main>
    </div>
  );
}
