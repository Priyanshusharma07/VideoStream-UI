"use client";

import Link from "next/link";
import type { Creator } from "@/types/content";
import { useToast } from "@/components/ui/ToastProvider";

export function AppSidebar({
  activePath,
}: {
  activePath: string;
  subscriptions?: Creator[];
  user?: { name: string; planLabel: string; avatarUrl: string };
}) {
  const toast = useToast();
  const items = [
    { icon: "home", label: "Home", path: "/" },
    { icon: "explore", label: "Explore", path: "/explore" },
    { icon: "dashboard", label: "Library", path: "/dashboard" },
    { icon: "add_circle", label: "Upload", path: "/upload" },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-20 flex-col items-center py-24 gap-4 z-40 bg-transparent border-r border-white/5">
      {items.map((item) => {
        const isActive = activePath === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              isActive 
                ? "bg-primary text-black shadow-[0_0_20px_rgba(179,197,255,0.4)]" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <span 
              className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            
            {/* Tooltip */}
            <div className="absolute left-16 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
              {item.label}
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-8 border-transparent border-r-white" />
            </div>
          </Link>
        );
      })}
      
      <div className="mt-auto flex flex-col gap-4">
        <button 
          onClick={() => toast.push({ variant: "info", title: "Settings", message: "User preferences are coming soon!" })}
          className="w-12 h-12 flex items-center justify-center rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </aside>
  );
}


