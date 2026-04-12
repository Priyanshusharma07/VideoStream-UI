import Link from "next/link";
import Image from "next/image";
import type { Creator } from "@/types/content";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { BookmarkIcon, CompassIcon, HomeIcon, UploadIcon } from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { href: "/feed", label: "Home Feed", icon: HomeIcon },
  { href: "/discover", label: "Discover", icon: CompassIcon },
  { href: "/watchlist", label: "Watchlist", icon: BookmarkIcon },
  { href: "/upload", label: "Upload", icon: UploadIcon },
];

function AvatarOrInitial({
  src,
  name,
  size = 28,
}: {
  src: string;
  name: string;
  size?: number;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-lg object-cover ring-1 ring-white/10"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 text-[11px] font-bold text-white ring-1 ring-white/10"
    >
      {(name ?? "?")[0].toUpperCase()}
    </div>
  );
}

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
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-white/[0.06] bg-[#070A12] px-4 py-5">
      <div className="px-2 py-2">
        <StreamHubLogo href="/feed" />
      </div>

      {/* Nav */}
      <nav className="mt-6 space-y-1">
        {NAV.map((item) => {
          const isActive = activePath === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/20"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="mt-8">
          <div className="px-2 text-[10px] font-semibold tracking-[0.22em] text-white/30">
            SUBSCRIPTIONS
          </div>
          <div className="mt-3 space-y-1">
            {subscriptions.slice(0, 8).map((c) => (
              <Link
                key={c.id}
                href={`/explore?creator=${encodeURIComponent(c.id)}`}
                className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white"
              >
                <div className="relative shrink-0">
                  <AvatarOrInitial src={c.avatarUrl} name={c.name} size={28} />
                  {c.isLive && (
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-black/60" />
                  )}
                </div>
                <span className="truncate">{c.name}</span>
                {c.isLive && (
                  <span className="ml-auto shrink-0 text-[9px] font-bold text-emerald-400">LIVE</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* User card at bottom */}
      <div className="mt-auto">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <AvatarOrInitial src={user.avatarUrl} name={user.name} size={40} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white/90">
                {user.name}
              </div>
              <div className="text-xs text-white/45">{user.planLabel}</div>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="mt-3 flex w-full items-center justify-center rounded-xl bg-white/8 px-4 py-2 text-xs font-semibold text-white/70 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
          >
            Dashboard →
          </Link>
        </div>
      </div>
    </aside>
  );
}
