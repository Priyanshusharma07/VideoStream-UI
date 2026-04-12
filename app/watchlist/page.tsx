import { AppSidebar } from "@/components/app/AppSidebar";
import { BookmarkIcon } from "@/components/icons";
import { getDemoFeed } from "@/lib/demo/content";
import { WatchlistClient } from "@/app/watchlist/WatchlistClient";

export default function WatchlistPage() {
  const feed = getDemoFeed();

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0">
          <AppSidebar
            activePath="/watchlist"
            subscriptions={feed.subscriptions}
            user={{
              name: "Arjun Sharma",
              planLabel: "Premium Member",
              avatarUrl: "/demo/avatars/avatar-02.svg",
            }}
          />
        </div>
      </div>

      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-purple-600/8 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 py-6 lg:pl-[19.5rem]">
        <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookmarkIcon className="h-6 w-6 text-sky-400" />
              <div>
                <h1 className="text-xl font-semibold">My Watchlist</h1>
                <p className="text-xs text-white/45">
                  Saved videos from localStorage (demo)
                </p>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <WatchlistClient />
          </section>
        </div>
      </div>
    </div>
  );
}
