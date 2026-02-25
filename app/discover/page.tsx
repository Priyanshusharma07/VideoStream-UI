import Link from "next/link";
import { AppSidebar } from "@/components/app/AppSidebar";
import { getDemoFeed } from "@/lib/demo/content";

export default function DiscoverPage() {
  const feed = getDemoFeed();
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0">
          <AppSidebar
            activePath="/discover"
            subscriptions={feed.subscriptions}
            user={{
              name: "Arjun Sharma",
              planLabel: "Premium Member",
              avatarUrl: "/demo/avatars/avatar-02.svg",
            }}
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1400px] px-5 py-10 lg:pl-[19.5rem]">
        <div className="rounded-3xl bg-black/35 p-8 ring-1 ring-white/10 backdrop-blur">
          <h1 className="text-2xl font-semibold">Discover</h1>
          <p className="mt-2 text-sm text-white/55">
            UI coming next. For now, use Explore.
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-sky-500 px-5 text-sm font-semibold text-black hover:bg-sky-400"
          >
            Go to Explore
          </Link>
        </div>
      </main>
    </div>
  );
}

