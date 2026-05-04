"use client";

import { useUploads } from "@/context/UploadContext";
import Link from "next/link";

export function GlobalUploadIndicator() {
  const { uploads, clearUpload } = useUploads();
  
  const activeUploads = uploads.filter((u) => u.status === "active");
  const completedUploads = uploads.filter((u) => u.status === "completed" || u.status === "error");

  if (activeUploads.length === 0 && completedUploads.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col gap-3 w-80">
      {uploads.map((u) => (
        <div
          key={u.id}
          className={`glass-panel p-4 rounded-2xl shadow-2xl border transition-all duration-500 animate-in slide-in-from-right ${
            u.status === "completed" ? "border-primary/40 bg-primary/5" : u.status === "error" ? "border-red-500/40 bg-red-500/5" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`material-symbols-outlined text-[18px] ${u.status === "completed" ? "text-primary" : u.status === "error" ? "text-red-400" : "text-white/40 animate-spin"}`}>
                {u.status === "completed" ? "check_circle" : u.status === "error" ? "error" : "sync"}
              </span>
              <span className="text-xs font-bold text-white truncate">{u.title}</span>
            </div>
            {u.status !== "active" && (
              <button onClick={() => clearUpload(u.id)} className="text-white/30 hover:text-white">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {u.status === "active" ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                <span>{u.phase}...</span>
                <span>{u.progress}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${u.progress}%` }}
                />
              </div>
            </div>
          ) : u.status === "completed" ? (
            <div className="flex items-center justify-between mt-2">
               <span className="text-[10px] font-bold text-primary uppercase">Finished</span>
               <Link href={`/watch/${u.videoId}`} className="text-[10px] font-black text-white hover:text-primary transition-colors uppercase tracking-widest">
                  View Video
               </Link>
            </div>
          ) : (
            <p className="text-[10px] font-bold text-red-400 line-clamp-1">{u.error}</p>
          )}
        </div>
      ))}
    </div>
  );
}
