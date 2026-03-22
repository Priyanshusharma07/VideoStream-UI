import Link from "next/link";
import Image from "next/image";
import type { Creator } from "@/types/content";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { BookmarkIcon, CompassIcon, HomeIcon } from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { href: "/feed", label: "Home Feed", icon: HomeIcon },
  { href: "/discover", label: "Discover", icon: CompassIcon },
  { href: "/watchlist", label: "Watchlist", icon: BookmarkIcon },
];

export function AppSidebar({
  activePath,
  subscriptions,
  user,
}: {
  activePath: string;
  subscriptions: Creator[];
  user: { name: string; planLabel: string; avatarUrl: string };
}) {
  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-black/35 px-5 py-6 backdrop-blur">
      <div className="px-2">
        <StreamHubLogo />
      </div>

      <nav className="mt-6 space-y-2">
        {NAV.map((item) => {
          const isActive = activePath === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                isActive
                  ? "bg-sky-500/15 text-white ring-1 ring-sky-500/20"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <div className="px-2 text-[10px] font-semibold tracking-[0.22em] text-white/30">
          SUBSCRIPTIONS
        </div>
        <div className="mt-3 space-y-2">
          {subscriptions.map((c) => (
            <Link
              key={c.id}
              href="/explore"
              className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white"
            >
              <div className="relative">
                <Image
                  src={c.avatarUrl}
                  alt={c.name}
                  width={28}
                  height={28}
                  className="rounded-lg ring-1 ring-white/10"
                />
                {c.isLive ? (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-black/60" />
                ) : null}
              </div>
              <span className="truncate">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-xl ring-1 ring-white/10"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white/90">
                {user.name}
              </div>
              <div className="text-xs text-white/45">{user.planLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
