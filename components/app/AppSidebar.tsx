"use client";

import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";

const NAV_ITEMS = [
  { icon: "home", label: "Home", path: "/" },
  { icon: "explore", label: "Explore", path: "/explore" },
  { icon: "sensors", label: "Live", path: "/live" },
  { icon: "video_library", label: "Library", path: "/dashboard" },
  { icon: "add_circle", label: "Upload", path: "/upload" },
];

export function AppSidebar({
  activePath,
}: {
  activePath: string;
}) {
  const toast = useToast();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-20 flex-col items-center pt-28 pb-8 gap-3 z-40 bg-transparent border-r border-white/5">
      {NAV_ITEMS.map((item) => {
        const isActive = activePath === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            title={item.label}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              isActive
                ? "bg-primary-container text-white shadow-[0_0_20px_rgba(0,102,255,0.3)]"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:scale-110"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>

            {/* Tooltip */}
            <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
              {item.label}
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white" />
            </div>
          </Link>
        );
      })}

      {/* Bottom: Settings */}
      <div className="mt-auto">
        <button
          onClick={() =>
            toast.push({
              variant: "info",
              title: "Settings",
              message: "User preferences are coming soon!",
            })
          }
          title="Settings"
          className="group relative w-12 h-12 flex items-center justify-center rounded-2xl text-white/30 hover:text-white hover:bg-white/5 transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
            Settings
            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white" />
          </div>
        </button>
      </div>
    </aside>
  );
}
