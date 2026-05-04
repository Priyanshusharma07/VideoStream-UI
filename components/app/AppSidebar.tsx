"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { clearAuthSession } from "@/lib/auth-session";

const NAV_ITEMS = [
  { icon: "home", label: "Home", path: "/" },
  { icon: "explore", label: "Explore", path: "/explore" },
  { icon: "sensors", label: "Live", path: "/live" },
  { icon: "video_library", label: "Dashboard", path: "/dashboard" },
  { icon: "add_circle", label: "Upload", path: "/upload" },
];

export function AppSidebar({
  activePath,
}: {
  activePath: string;
}) {
  const toast = useToast();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthSession();
    
    toast.push({
      variant: "success",
      title: "Logged Out",
      message: "Session ended. See you soon!",
    });
    
    router.push("/login");
  };

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
                ? "bg-primary text-black shadow-[0_0_20px_rgba(179,197,255,0.4)]"
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
            <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
              {item.label}
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white" />
            </div>
          </Link>
        );
      })}

      {/* Bottom: Logout */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          title="Logout"
          className="group relative w-12 h-12 flex items-center justify-center rounded-2xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
            Logout
            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-500" />
          </div>
        </button>
      </div>
    </aside>
  );
}
