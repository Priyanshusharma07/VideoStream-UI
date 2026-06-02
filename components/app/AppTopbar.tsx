"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TopbarSearch } from "./TopbarSearch";
import { useToast } from "@/components/ui/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { useAuth, UserButton } from "@clerk/nextjs";

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
  const { isLoaded, userId } = useAuth();

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
            <div className="w-8 h-8 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,0,85,0.4)]">
                <defs>
                  <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ff0055', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#b3003b', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M85,50 C85,69.33 69.33,85 50,85 C30.67,85 15,69.33 15,50 C15,30.67 30.67,15 50,15 L50,28 C37.85,28 28,37.85 28,50 C28,62.15 37.85,72 50,72 C62.15,72 72,62.15 72,50 L85,50 Z" fill="url(#brandGradient)" />
                <path d="M45,35 L65,50 L45,65 Z" fill="white" />
              </svg>
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
            <div className="flex-shrink-0">
              {isLoaded && userId ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center p-[2px] bg-gradient-to-br from-primary via-secondary to-tertiary shadow-lg shadow-primary/20">
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-full h-full border border-black/50"
                      }
                    }}
                  />
                </div>
              ) : isLoaded && !userId ? (
                <Link href="/login" className="bg-primary hover:bg-blue-600 text-white font-bold text-[13px] px-5 py-2 rounded-xl transition-all shadow-lg shadow-primary/20">
                  Sign In
                </Link>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
