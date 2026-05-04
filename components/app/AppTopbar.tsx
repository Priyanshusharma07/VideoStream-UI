"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TopbarSearch } from "./TopbarSearch";
import { useToast } from "@/components/ui/ToastProvider";
import { useTheme } from "@/context/ThemeContext";

const NAV_LINKS = [
  { label: "Cinema", path: "/explore?cat=cinema" },
  { label: "Feed", path: "/feed" },
  { label: "Dashboard", path: "/dashboard" },
];

export function AppTopbar({
  placeholder = "Search cinematic universe...",
  rightSlot,
}: {
  placeholder?: string;
  rightSlot?: React.ReactNode;
}) {
  const toast = useToast();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const handleNotifications = () => {
    toast.push({
      variant: "info",
      title: "Notifications",
      message: "Your cinematic feed is up to date.",
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-5 pointer-events-none">
      <header className="pointer-events-auto max-w-[1500px] mx-auto flex items-center justify-between px-6 py-2 bg-black/40 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/5">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xl font-black tracking-tighter text-white font-headline-lg flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-black rotate-3 group-hover:rotate-12 transition-transform">
               <span className="material-symbols-outlined text-[20px] font-black">movie</span>
            </div>
            <span className="tracking-[-0.05em] uppercase">Cineview</span>
          </Link>
          
          <nav className="hidden lg:flex gap-6 items-center">
            {NAV_LINKS.map(({ label, path }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className={`text-[13px] font-black uppercase tracking-widest transition-all hover:text-white ${
                    isActive ? "text-primary" : "text-white/40"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex-1 max-w-[300px]">
            <TopbarSearch placeholder={placeholder} />
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>

            {/* Notification */}
            <button
              onClick={handleNotifications}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>

          {/* Profile */}
          {rightSlot || (
            <Link href="/dashboard" className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-primary via-secondary to-tertiary hover:rotate-12 transition-transform duration-500 shadow-lg shadow-primary/20">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-black text-white border border-black/50 overflow-hidden">
                   <img src="https://i.pravatar.cc/100?u=cineview" alt="Avatar" className="w-full h-full object-cover opacity-80" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
