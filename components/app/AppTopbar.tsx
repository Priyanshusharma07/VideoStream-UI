"use client";

import Link from "next/link";
import { TopbarSearch } from "./TopbarSearch";
import { useToast } from "@/components/ui/ToastProvider";
import { useTheme } from "@/src/hooks/useTheme";

export function AppTopbar({
  placeholder = "Search movies, creators, topics...",
  rightSlot,
}: {
  placeholder?: string;
  rightSlot?: React.ReactNode;
}) {
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();

  const handleNotifications = () => {
    toast.push({
      variant: "info",
      title: "Notifications",
      message: "You have no new notifications at this time.",
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 lg:px-12 py-4 bg-transparent backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-2xl font-black tracking-tighter text-white font-display-xl flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-black font-bold text-xl">play_arrow</span>
          </div>
          CINEVIEW
        </Link>
        <div className="hidden lg:flex items-center gap-8 font-manrope text-sm font-bold tracking-wide">
          <Link className="text-white hover:text-primary transition-colors" href="/">Explore</Link>
          <Link className="text-white/60 hover:text-white transition-colors" href="/live">Live</Link>
          <Link className="text-white/60 hover:text-white transition-colors" href="/feed">Feed</Link>
          <Link className="text-white/60 hover:text-white transition-colors" href="/dashboard">Library</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-72 lg:w-96">
          <TopbarSearch placeholder={placeholder} />
        </div>
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 hover:bg-white/5 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-white/10 group"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="material-symbols-outlined text-white/60 group-hover:text-primary transition-colors">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <button 
            onClick={handleNotifications}
            className="w-10 h-10 hover:bg-white/5 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-white/10 group"
          >
            <span className="material-symbols-outlined text-white/60 group-hover:text-white">notifications</span>
          </button>
          
          {rightSlot || (
            <Link href="/profile" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all border border-white/10 group">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-black text-white">
                AS
              </div>
              <span className="text-sm font-bold text-white/80 group-hover:text-white">Profile</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}



