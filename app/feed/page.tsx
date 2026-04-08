import Link from "next/link";
import Image from "next/image";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { ForYouSection } from "@/components/feed/ForYouSection";
import { getApi } from "@/services/api-client";
import type { FeedPayload } from "@/types/content";

export const dynamic = "force-dynamic";

function safeUrl(url: string | null | undefined, fallback: string) {
  const trimmed = typeof url === "string" ? url.trim() : "";
  return trimmed ? trimmed : fallback;
}

function normalizeFeed(feed: FeedPayload): FeedPayload {
  return {
    ...feed,
    subscriptions: (feed.subscriptions ?? []).map((s) => ({
      ...s,
      avatarUrl: safeUrl(s.avatarUrl, "/demo/avatars/avatar-02.svg"),
    })),
    trending: (feed.trending ?? []).map((v) => ({
      ...v,
      thumbnailUrl: safeUrl(v.thumbnailUrl, "/demo/thumbs/thumb-01.svg"),
      creator: {
        ...v.creator,
        avatarUrl: safeUrl(v.creator.avatarUrl, "/demo/avatars/avatar-02.svg"),
      },
    })),
    forYou: (feed.forYou ?? []).map((v) => ({
      ...v,
      thumbnailUrl: safeUrl(v.thumbnailUrl, "/demo/thumbs/thumb-01.svg"),
      creator: {
        ...v.creator,
        avatarUrl: safeUrl(v.creator.avatarUrl, "/demo/avatars/avatar-02.svg"),
      },
    })),
  };
}

export default async function FeedPage() {
  const result = await getApi<FeedPayload>("/feed", { cache: "no-store" });
  if (!result.ok) throw new Error(result.error.message);
  const feed = normalizeFeed(result.data);

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0">
          <AppSidebar
            activePath="/feed"
            subscriptions={feed.subscriptions}
            user={{
              name: "Arjun Sharma",
              planLabel: "Premium Member",
              avatarUrl: "/demo/avatars/avatar-02.svg",
            }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 py-6 lg:pl-[19.5rem]">
        <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
          <AppTopbar placeholder="Search streams, movies, or creators..." />

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">
                {feed.trendingTitle}
              </h2>
              <Link href="/explore" className="text-xs text-cyan-300 hover:underline">
                View All
              </Link>
            </div>

            <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {feed.trending.map((v) => (
                <Link
                  key={v.id}
                  href={`/watch/${v.id}`}
                  className="w-[260px] shrink-0"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                    <Image
                      src={v.thumbnailUrl}
                      alt={v.title}
                      width={960}
                      height={540}
                      className="h-24 w-full object-cover opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/0" />
                    <div className="absolute left-3 top-3">
                      {v.kind === "live" ? (
                        <span className="rounded-md bg-cyan-400 px-2 py-1 text-[10px] font-bold tracking-[0.18em] text-black">
                          LIVE
                        </span>
                      ) : null}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="truncate text-sm font-semibold text-white/90">
                        {v.title}
                      </div>
                      <div className="mt-1 text-xs text-white/55">
                        {v.viewsLabel}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <ForYouSection filters={feed.forYouFilters} videos={feed.forYou} />
        </div>
      </div>
    </div>
  );
}
