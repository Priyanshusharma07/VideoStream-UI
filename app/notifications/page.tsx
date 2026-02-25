import Link from "next/link";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { BellIcon, PlayIcon, StarIcon, TrendingIcon } from "@/components/icons";

type NotifKind = "new_video" | "live" | "milestone" | "system";

type Notification = {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
  avatarInitials: string;
  avatarColor: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    kind: "live",
    title: "React Team is live!",
    body: "React Conference 2024: Keynote and New Features is streaming now.",
    time: "Just now",
    read: false,
    avatarInitials: "RT",
    avatarColor: "from-sky-500 to-cyan-400",
  },
  {
    id: "n2",
    kind: "new_video",
    title: "New upload from Design Sense",
    body: "\"Mastering Minimal UI: A Comprehensive Guide\" — 18:10 min",
    time: "2 hours ago",
    read: false,
    avatarInitials: "DS",
    avatarColor: "from-purple-500 to-pink-500",
  },
  {
    id: "n3",
    kind: "milestone",
    title: "You hit 1M views! 🎉",
    body: "Your channel crossed 1 million total views. Keep creating!",
    time: "Yesterday",
    read: true,
    avatarInitials: "SH",
    avatarColor: "from-emerald-500 to-teal-400",
  },
  {
    id: "n4",
    kind: "new_video",
    title: "BiteSized posted: Street Food Tour",
    body: "\"Street Food Tour: Kolkata Edition\" — 24:00 min",
    time: "2 days ago",
    read: true,
    avatarInitials: "BS",
    avatarColor: "from-orange-500 to-red-400",
  },
  {
    id: "n5",
    kind: "system",
    title: "Subscription renewed",
    body: "StreamHub Pro has been renewed for $9.00 on Feb 12, 2026.",
    time: "2 weeks ago",
    read: true,
    avatarInitials: "SH",
    avatarColor: "from-indigo-500 to-sky-500",
  },
];

function kindIcon(kind: NotifKind) {
  if (kind === "live") return <span className="h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-black/60 absolute -top-1 -right-1" />;
  if (kind === "milestone") return null;
  return null;
}

function kindBadge(kind: NotifKind) {
  if (kind === "live")
    return (
      <span className="rounded-md bg-cyan-400 px-2 py-0.5 text-[10px] font-bold tracking-widest text-black">
        LIVE
      </span>
    );
  if (kind === "milestone")
    return (
      <span className="rounded-md bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold tracking-widest text-amber-300 ring-1 ring-amber-400/20">
        MILESTONE
      </span>
    );
  if (kind === "system")
    return (
      <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white/50">
        SYSTEM
      </span>
    );
  return null;
}

export default function NotificationsPage() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#070A12] px-6 py-10 text-white">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-400/8 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <StreamHubLogo />
          <Link href="/feed" className="text-sm text-white/50 hover:text-white">
            ← Feed
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <BellIcon className="h-6 w-6 text-white/70" />
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-sky-500 px-2.5 py-0.5 text-xs font-bold text-black">
              {unreadCount}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-white/45">
          Stay up to date with your subscriptions and activity.
        </p>

        {/* Mark all read button */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs font-semibold tracking-[0.22em] text-white/35">
            ALL NOTIFICATIONS
          </div>
          <button
            type="button"
            className="text-xs text-cyan-300 hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {/* Notification list */}
        <div className="mt-3 space-y-3">
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className={[
                "relative flex gap-4 rounded-2xl p-4 ring-1 transition",
                !n.read
                  ? "bg-sky-500/5 ring-sky-500/20"
                  : "bg-black/35 ring-white/8 backdrop-blur",
              ].join(" ")}
            >
              {/* Unread dot */}
              {!n.read && (
                <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-sky-400" />
              )}

              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${n.avatarColor} text-xs font-bold text-white shadow-lg`}
                >
                  {n.avatarInitials}
                </div>
                {kindIcon(n.kind)}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-white/90">
                    {n.title}
                  </span>
                  {kindBadge(n.kind)}
                </div>
                <p className="mt-1 text-xs text-white/55 leading-relaxed">{n.body}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[10px] text-white/35">{n.time}</span>
                  {n.kind === "live" && (
                    <Link
                      href="/feed"
                      className="flex items-center gap-1 text-[10px] font-semibold text-cyan-300 hover:underline"
                    >
                      <PlayIcon className="h-3 w-3" />
                      Watch Now
                    </Link>
                  )}
                  {n.kind === "new_video" && (
                    <Link
                      href="/feed"
                      className="text-[10px] font-semibold text-sky-300 hover:underline"
                    >
                      Watch
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats summary */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: <PlayIcon className="h-5 w-5 text-sky-400" />, label: "New videos", value: "12" },
            { icon: <TrendingIcon className="h-5 w-5 text-emerald-400" />, label: "Live streams", value: "3" },
            { icon: <StarIcon className="h-5 w-5 text-amber-400" />, label: "Milestones", value: "1" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-black/35 p-4 text-center ring-1 ring-white/10 backdrop-blur"
            >
              <div className="flex justify-center">{s.icon}</div>
              <div className="mt-2 text-lg font-extrabold text-white/90">{s.value}</div>
              <div className="mt-0.5 text-[10px] text-white/40">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            href="/feed"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-white text-sm font-semibold text-black hover:bg-white/90"
          >
            Go to Feed
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white/10 px-5 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/15"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
