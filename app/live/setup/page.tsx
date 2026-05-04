"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startLiveStream } from "@/services/videos-client";
import { useToast } from "@/components/ui/ToastProvider";

const CATEGORIES = [
  { label: "Cinema", slug: "cinema", icon: "movie" },
  { label: "Gaming", slug: "gaming", icon: "sports_esports" },
  { label: "Music", slug: "music", icon: "music_note" },
  { label: "Talk Show", slug: "talk-show", icon: "forum" },
];

export default function LiveSetupPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("cinema");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleStart() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await startLiveStream({ title, category });
      if (res.ok) {
        toast.push({ variant: "success", title: "Live Initialized", message: "Preparing your cinematic broadcast..." });
        router.push(`/live/broadcast/${res.data.videoId}`);
      } else {
        toast.push({ variant: "error", title: "Error", message: res.error.message });
      }
    } catch (err) {
      toast.push({ variant: "error", title: "Connection Failed", message: "Could not reach the studio server." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-xl glass-panel p-10 rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[60px] -z-10" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 shadow-[0_0_20px_rgba(179,197,255,0.3)]">
            <span className="material-symbols-outlined text-3xl">sensors</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Live Setup</h1>
          <p className="text-white/40 font-medium">Configure your production parameters.</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Stream Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Cinematic Jazz — Live"
              className="w-full h-14 rounded-2xl bg-white/5 px-6 text-sm text-white placeholder:text-white/20 outline-none border border-white/5 focus:border-primary/60 focus:bg-white/10 transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setCategory(cat.slug)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-bold transition-all border ${
                    category === cat.slug ? "bg-primary text-black border-primary" : "bg-white/5 text-white/40 border-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!title.trim() || loading}
            className="w-full py-5 rounded-[2rem] bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? "Initializing..." : "Go Live Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
