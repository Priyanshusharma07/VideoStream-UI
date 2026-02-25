import Image from "next/image";
import Link from "next/link";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { PlusIcon } from "@/components/icons";
import { getDemoDashboard } from "@/lib/demo/content";

export default function DashboardPage() {
  const dashboard = getDemoDashboard();

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-6">
          <StreamHubLogo />
          <nav className="hidden items-center gap-5 text-sm text-white/65 md:flex">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/feed" className="hover:text-white">
              Library
            </Link>
            <Link href="/explore" className="hover:text-white">
              Community
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl bg-white/5 px-4 py-2 text-xs text-white/55 ring-1 ring-white/10 md:block">
            Search content...
          </div>
          <Image
            src={dashboard.user.avatarUrl}
            alt={dashboard.user.name}
            width={36}
            height={36}
            className="rounded-xl ring-1 ring-white/10"
          />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1200px] gap-6 px-6 pb-14 pt-8 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
          <div className="flex items-start gap-4">
            <Image
              src={dashboard.user.avatarUrl}
              alt={dashboard.user.name}
              width={56}
              height={56}
              className="rounded-2xl ring-1 ring-white/10"
            />
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-white/90">
                {dashboard.user.name}
              </div>
              <div className="text-sm text-white/45">{dashboard.user.handle}</div>
            </div>
          </div>

          <Link
            href="/upload"
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 text-sm font-semibold text-black hover:bg-sky-400"
          >
            <PlusIcon className="h-5 w-5" />
            Upload Video
          </Link>

          <div className="mt-8">
            <div className="text-[10px] font-semibold tracking-[0.22em] text-white/35">
              SUBSCRIPTION
            </div>
            <div className="mt-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-sm font-semibold text-white/90">
                {dashboard.user.planName}
              </div>
              <div className="mt-2 text-xs text-white/45">
                Renews Oct 12, 2026
              </div>
              <Link
                href="/billing"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
              >
                Manage Billing
              </Link>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {dashboard.stats.map((s) => (
              <div
                key={s.id}
                className={[
                  "rounded-3xl p-6 text-white ring-1 ring-white/10",
                  s.id === "views"
                    ? "bg-gradient-to-r from-sky-500/90 to-blue-600/90"
                    : "bg-gradient-to-r from-indigo-600/90 to-purple-600/90",
                ].join(" ")}
              >
                <div className="text-xs text-white/80">{s.label}</div>
                <div className="mt-2 text-3xl font-extrabold">{s.value}</div>
                <div className="mt-2 text-xs text-white/80">{s.deltaLabel}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white/90">
                Recent Watch History
              </div>
              <Link href="/feed" className="text-xs text-cyan-300 hover:underline">
                View All
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {dashboard.recentHistory.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <Image
                    src={h.thumbnailUrl}
                    alt={h.title}
                    width={120}
                    height={68}
                    className="h-[68px] w-[120px] rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white/90">
                      {h.title}
                    </div>
                    <div className="mt-1 text-xs text-white/45">{h.meta}</div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-purple-400"
                        style={{ width: `${Math.round(h.progress * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
