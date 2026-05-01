"use client";

import Link from "next/link";
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
    body: "CINEGLAS Pro has been renewed for $9.00 on Feb 12, 2026.",
    time: "2 weeks ago",
    read: true,
    avatarInitials: "SH",
    avatarColor: "from-indigo-500 to-sky-500",
  },
];

function kindBadge(kind: NotifKind) {
  if (kind === "live")
    return (
      <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-secondary border border-secondary/20 uppercase">
        LIVE
      </span>
    );
  if (kind === "milestone")
    return (
      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-primary border border-primary/20 uppercase">
        MILESTONE
      </span>
    );
  if (kind === "system")
    return (
      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-white/40 border border-white/5 uppercase">
        SYSTEM
      </span>
    );
  return null;
}

export default function NotificationsPage() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="py-12 px-[5vw] max-w-4xl mx-auto">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            Notifications
            {unreadCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            )}
          </h1>
          <p className="mt-2 text-white/50 font-medium">
            Stay up to date with your cinematic world.
          </p>
        </div>
        <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:brightness-110 transition-all">
          Mark All Read
        </button>
      </div>

      <div className="space-y-4">
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className={`group relative flex gap-6 rounded-[2rem] p-6 transition-all border ${
              !n.read
                ? "bg-primary/5 border-primary/20"
                : "glass-panel border-white/5 hover:border-white/10"
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${n.avatarColor} text-lg font-black text-white shadow-lg`}
              >
                {n.avatarInitials}
              </div>
              {!n.read && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary border-4 border-[#080a0f]" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-lg font-bold text-white leading-tight">
                  {n.title}
                </span>
                {kindBadge(n.kind)}
              </div>
              <p className="text-sm text-white/50 font-medium leading-relaxed mb-4">{n.body}</p>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{n.time}</span>
                {n.kind === "live" && (
                  <Link
                    href="/feed"
                    className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">play_circle</span>
                    Watch Now
                  </Link>
                )}
                {(n.kind === "new_video") && (
                  <Link
                    href="/feed"
                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Watch
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats summary */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: "video_library", label: "New videos", value: "12", color: "text-primary", bg: "bg-primary/10" },
          { icon: "sensors", label: "Live streams", value: "3", color: "text-secondary", bg: "bg-secondary/10" },
          { icon: "military_tech", label: "Milestones", value: "1", color: "text-white", bg: "bg-white/5" },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-panel p-8 rounded-[2rem] text-center group hover:border-white/10 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-4`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tighter">{s.value}</div>
            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex gap-4">
        <Link
          href="/feed"
          className="flex-1 h-14 flex items-center justify-center rounded-2xl bg-white text-black font-black hover:brightness-90 transition-all"
        >
          Back to Feed
        </Link>
        <Link
          href="/"
          className="px-8 h-14 flex items-center justify-center rounded-2xl glass-panel border-white/10 text-white font-bold hover:bg-white/5 transition-all"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

