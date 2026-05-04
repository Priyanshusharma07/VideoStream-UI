"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { VideoCard } from "@/components/video/VideoCard";
import type { Video } from "@/types/content";
import { mockVideos } from "@/src/data/mockVideos";

const PROFILE_DATA = {
  name: "Arjun Sharma",
  handle: "@arjun_creates",
  bio: "Cinematic storyteller & tech enthusiast. I build immersive digital experiences and capture stories that matter. Join me on my journey through the lens.",
  followers: "1.2M",
  videosCount: 142,
  viewsCount: "85M",
  bannerUrl: "/demo/thumbs/thumb-01.svg",
  avatarUrl: "/demo/avatars/avatar-01.svg",
  isVerified: true,
};

const TABS = ["Videos", "Live", "About"] as const;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Videos");
  
  // Filter videos for this "creator" (using Tech as a proxy for his content)
  const creatorVideos: Video[] = mockVideos
    .filter(v => v.category === "Tech" || v.category === "Education")
    .map(v => ({
      id: v.id,
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      kind: "video",
      category: v.category,
      creator: {
        id: "arjun",
        name: PROFILE_DATA.name,
        avatarUrl: PROFILE_DATA.avatarUrl
      },
      viewsLabel: `${(v.views / 1000).toFixed(1)}K`,
      uploadedLabel: "2 months ago",
      status: "ready",
      description: v.description
    }));

  return (
    <div className="min-h-screen">
      {/* Immersive Banner */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <Image
          src={PROFILE_DATA.bannerUrl}
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/20 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="relative px-[5vw] -mt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end gap-8 mb-12">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-40 h-40 rounded-[2.5rem] border-8 border-[#080a0f] overflow-hidden shadow-2xl">
              <Image
                src={PROFILE_DATA.avatarUrl}
                alt={PROFILE_DATA.name}
                fill
                className="object-cover"
              />
            </div>
            {PROFILE_DATA.isVerified && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-[#080a0f] shadow-lg">
                <span className="material-symbols-outlined text-black font-black text-xl">verified</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                  {PROFILE_DATA.name}
                </h1>
                <p className="text-primary font-black tracking-widest text-xs uppercase opacity-80">
                  {PROFILE_DATA.handle}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="h-14 px-10 rounded-2xl bg-white text-black font-black hover:brightness-90 transition-all shadow-xl shadow-white/5">
                  Follow
                </button>
                <button className="w-14 h-14 rounded-2xl glass-panel border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-8">
              {[
                { label: "Followers", value: PROFILE_DATA.followers },
                { label: "Videos", value: PROFILE_DATA.videosCount },
                { label: "Total Views", value: PROFILE_DATA.viewsCount },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-white tracking-tight">{stat.value}</div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="max-w-3xl glass-panel p-8 rounded-[2rem] mb-12">
          <p className="text-white/60 font-medium leading-relaxed italic">
            &ldquo;{PROFILE_DATA.bio}&rdquo;
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-white/5 mb-12">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${
                activeTab === tab ? "text-primary" : "text-white/30 hover:text-white/60"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Videos" && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {creatorVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}

        {activeTab === "Live" && (
          <div className="py-24 text-center glass-panel rounded-[3rem]">
            <span className="material-symbols-outlined text-4xl text-white/10 mb-4">sensors_off</span>
            <p className="text-white/30 font-bold tracking-widest uppercase text-xs">
              No active broadcasts at the moment
            </p>
          </div>
        )}

        {activeTab === "About" && (
          <div className="max-w-4xl space-y-12">
            <div className="glass-panel p-10 rounded-[2.5rem]">
              <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider">Channel Details</h3>
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                    <span className="text-sm font-bold text-white/70">Joined April 2024</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">language</span>
                    <span className="text-sm font-bold text-white/70">Based in Mumbai, India</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">link</span>
                    <Link href="#" className="text-sm font-bold text-sky-400 hover:underline">arjunsharma.studio</Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">alternate_email</span>
                    <span className="text-sm font-bold text-white/70">contact@arjunsharma.studio</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {["instagram", "twitter", "youtube", "linkedin"].map((social) => (
                <button key={social} className="w-14 h-14 rounded-2xl glass-panel border-white/5 flex items-center justify-center text-white/40 hover:text-primary transition-all">
                  <span className="material-symbols-outlined">public</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
