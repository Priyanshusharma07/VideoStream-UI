"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { getDashboardData } from "@/services/dashboard-client";
import type { DashboardPayload } from "@/types/content";

function DashboardContent() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData().then((res) => {
      if (!res.ok) {
        if (res.error.code === "unauthorized") {
          router.push("/login");
        }
        setLoading(false);
        return;
      }
      setDashboard(res.data);
      setLoading(false);
    });
  }, [router]);

  if (loading || !dashboard) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-[5vw]">
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight">Creator Hub</h1>
        <p className="mt-2 text-white/50 font-medium max-w-2xl">
          Manage your cinematic vision, track your audience impact, and optimize your creative workflow from one immersive interface.
        </p>
      </header>

      {/* Overview Section: Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
        {/* Main Stat (Views) */}
        <div className="glass-panel p-8 rounded-[2rem] md:col-span-2 flex flex-col justify-between group hover:border-primary/40 transition-all cursor-pointer">
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 block">Performance Peak</span>
            <h3 className="text-5xl font-black text-white tracking-tighter">{dashboard.stats.find(s => s.id === 'views')?.value || '0'}</h3>
            <p className="text-sm font-bold text-primary mt-2">{dashboard.stats.find(s => s.id === 'views')?.deltaLabel || '+0%'}</p>
          </div>
          <div className="mt-12 flex items-end gap-1.5 h-24">
            <div className="bg-primary/10 w-full h-[40%] rounded-xl group-hover:bg-primary/20 transition-all"></div>
            <div className="bg-primary/10 w-full h-[60%] rounded-xl group-hover:bg-primary/20 transition-all"></div>
            <div className="bg-primary/10 w-full h-[55%] rounded-xl group-hover:bg-primary/20 transition-all"></div>
            <div className="bg-primary/10 w-full h-[80%] rounded-xl group-hover:bg-primary/20 transition-all"></div>
            <div className="bg-primary w-full h-[95%] rounded-xl shadow-[0_0_20px_rgba(179,197,255,0.4)] transition-all"></div>
            <div className="bg-primary/10 w-full h-[70%] rounded-xl group-hover:bg-primary/20 transition-all"></div>
          </div>
        </div>

        {/* Subscribers */}
        <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between hover:border-white/20 transition-all cursor-pointer">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-6">
              <span className="material-symbols-outlined">group</span>
            </div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Subscribers</p>
            <h3 className="text-3xl font-black text-white mt-1 tracking-tight">{dashboard.stats.find(s => s.id === 'subscribers')?.value || '0'}</h3>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-10 overflow-hidden border border-white/5">
            <div className="bg-white/40 h-full w-[72%] shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
          </div>
        </div>

        {/* Est. Revenue */}
        <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between hover:border-secondary/40 transition-all cursor-pointer">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
              <span className="material-symbols-outlined">monetization_on</span>
            </div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Est. Revenue</p>
            <h3 className="text-3xl font-black text-white mt-1 tracking-tight">{dashboard.stats.find(s => s.id === 'revenue')?.value || '$0.00'}</h3>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
            <span className="text-xs font-black text-secondary uppercase tracking-widest">{dashboard.stats.find(s => s.id === 'revenue')?.deltaLabel || '+0%'}</span>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Recent Projects</h2>
            <p className="mt-1 text-sm text-white/40 font-medium">Your latest cinematic uploads and their engagement metrics.</p>
          </div>
          <Link href="/upload" className="bg-primary text-black font-black px-8 py-3 rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 text-sm">
            <span className="material-symbols-outlined text-sm font-black">add_circle</span>
            Upload New
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {dashboard.recentHistory.map((h) => (
            <Link key={h.id} href={`/watch/${h.id}`} className="group cursor-pointer">
              <div className="relative aspect-video rounded-3xl overflow-hidden glass-card mb-4 group-hover:border-primary/40 transition-all">
                <Image 
                  src={h.thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"} 
                  alt={h.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">4K MASTER</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                  <div className="h-full bg-primary shadow-[0_0_10px_rgba(179,197,255,0.8)]" style={{ width: `${Math.round(h.progress * 100)}%` }}></div>
                </div>
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1 leading-tight">{h.title}</h4>
              <div className="flex items-center gap-2 mt-2 text-white/40 text-[11px] font-black uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs">visibility</span>
                {h.meta}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">Loading Hub...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

