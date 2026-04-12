import Link from "next/link";
import Image from "next/image";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { ForYouSection } from "@/components/feed/ForYouSection";
import { VideoThumb } from "@/components/content/VideoThumb";
import { getApi } from "@/services/api-client";
import type { FeedPayload } from "@/types/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Feed" };

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function safeUrl(url: string | null | undefined) {
  const t = typeof url === "string" ? url.trim() : "";
  return t || "";
}

function normalizeFeed(feed: FeedPayload): FeedPayload {
  return {
    ...feed,
    subscriptions: (feed.subscriptions ?? []).map((s) => ({
      ...s,
      avatarUrl: safeUrl(s.avatarUrl),
    })),
    trending: (feed.trending ?? []).map((v) => ({
      ...v,
      thumbnailUrl: safeUrl(v.thumbnailUrl),
      creator: { ...v.creator, avatarUrl: safeUrl(v.creator.avatarUrl) },
    })),
    forYou: (feed.forYou ?? []).map((v) => ({
      ...v,
      thumbnailUrl: safeUrl(v.thumbnailUrl),
      creator: { ...v.creator, avatarUrl: safeUrl(v.creator.avatarUrl) },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────────
function EmptyFeed() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-28 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-600/15 ring-1 ring-white/8">
        <svg className="h-9 w-9 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>
      <div>
        <h3 className="text-base font-semibold text-white/75">Nothing here yet</h3>
        <p className="mt-1.5 max-w-[260px] text-sm leading-relaxed text-white/40">
          Upload your first video to get this feed started.
        </p>
      </div>
      <Link
        href="/upload"
        className="mt-1 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-sky-400 active:scale-95"
      >
        Upload a Video
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Featured hero card (first trending item)
// ─────────────────────────────────────────────────────────────────────────────
function HeroCard({ v }: { v: FeedPayload["trending"][number] }) {
  return (
    <Link
      href={`/watch/${v.id}`}
      className="group relative flex h-[340px] overflow-hidden rounded-2xl ring-1 ring-white/8 transition hover:ring-white/15"
    >
      <VideoThumb video={v} className="h-full w-full rounded-none" />

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          {v.kind === "live" && (
            <span className="flex items-center gap-1.5 rounded-md bg-rose-500 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
          )}
          <span className="rounded-md bg-black/50 px-2 py-0.5 text-[11px] text-white/70 backdrop-blur ring-1 ring-white/10">
            {v.viewsLabel}
          </span>
        </div>
        <h3 className="line-clamp-2 text-xl font-bold leading-snug text-white drop-shadow-lg">
          {v.title}
        </h3>
        <div className="mt-2.5 flex items-center gap-2">
          {v.creator.avatarUrl ? (
            <Image
              src={v.creator.avatarUrl}
              alt={v.creator.name}
              width={22}
              height={22}
              className="h-5 w-5 rounded-md object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-violet-600 text-[9px] font-bold text-white">
              {(v.creator.name ?? "?")[0].toUpperCase()}
            </div>
          )}
          <span className="text-xs font-medium text-white/65">{v.creator.name}</span>
          <span className="ml-auto text-xs text-white/40">{v.uploadedLabel}</span>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Smaller trending card (2nd+)
// ─────────────────────────────────────────────────────────────────────────────
function TrendingCard({ v }: { v: FeedPayload["trending"][number] }) {
  return (
    <Link href={`/watch/${v.id}`} className="group flex gap-3">
      {/* Thumb */}
      <div className="h-[72px] w-[128px] shrink-0 overflow-hidden rounded-xl">
        <VideoThumb video={v} className="h-full w-full rounded-none" />
      </div>
      {/* Meta */}
      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 text-sm font-semibold leading-snug text-white/85 group-hover:text-white transition-colors">
          {v.title}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/45">
          {v.kind === "live" && (
            <span className="rounded bg-rose-500/80 px-1.5 py-px text-[9px] font-bold tracking-wide text-white">LIVE</span>
          )}
          <span>{v.creator.name}</span>
          <span>·</span>
          <span>{v.viewsLabel}</span>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default async function FeedPage() {
  const result = await getApi<FeedPayload>("/feed", { cache: "no-store" });

  if (!result.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070A12] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <svg className="h-7 w-7 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.015H12v-.015Z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-white/70">Could not load feed</p>
          <p className="mt-1 text-sm text-white/35">{result.error.message}</p>
          <Link
            href="/feed"
            className="mt-5 inline-block rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-sky-400 transition-colors"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  }

  const feed = normalizeFeed(result.data);
  const [hero, ...rest] = feed.trending;
  const hasTrending = feed.trending.length > 0;
  const hasForYou = feed.forYou.length > 0;

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 z-30">
          <AppSidebar
            activePath="/feed"
            subscriptions={feed.subscriptions}
            user={{ name: "You", planLabel: "StreamHub", avatarUrl: "" }}
          />
        </div>
      </div>

      {/* Page */}
      <div className="lg:pl-72">
        {/* Sticky topbar */}
        <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#070A12]/90 px-5 py-3 backdrop-blur-md">
          <AppTopbar placeholder="Search videos, creators, streams..." />
        </div>

        <main className="px-5 py-6 pb-14">
          {/* Nothing at all */}
          {!hasTrending && !hasForYou ? (
            <EmptyFeed />
          ) : (
            <div className="mx-auto max-w-[1280px] space-y-10">

              {/* ── Trending section ── */}
              {hasTrending && (
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-white/35">
                      {feed.trendingTitle || "Trending Now"}
                    </h2>
                    <Link href="/explore" className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">
                      See all →
                    </Link>
                  </div>

                  {/* Hero + sidebar list layout */}
                  <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                    {/* Big hero card */}
                    {hero && <HeroCard v={hero} />}

                    {/* Remaining trending list */}
                    {rest.length > 0 && (
                      <div className="flex flex-col gap-4">
                        {rest.slice(0, 4).map((v) => (
                          <TrendingCard key={v.id} v={v} />
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* ── For You ── */}
              {hasForYou && (
                <ForYouSection filters={feed.forYouFilters} videos={feed.forYou} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
