"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopbarSearch } from "./TopbarSearch";
import { useToast } from "@/components/ui/ToastProvider";
import { useTheme } from "@/src/hooks/useTheme";

const NAV_LINKS = [
  { label: "Explore", path: "/" },
  { label: "Feed", path: "/feed" },
  { label: "Live", path: "/live" },
  { label: "Watchlist", path: "/watchlist" },
];

export function AppTopbar({
  placeholder = "Search creators, films, or tags...",
  rightSlot,
}: {
  placeholder?: string;
  rightSlot?: React.ReactNode;
}) {
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const handleNotifications = () => {
    toast.push({
      variant: "info",
      title: "Notifications",
      message: "You have no new notifications at this time.",
    });
  };

  return (
    // Outer wrapper: full-width, fixed, provides horizontal padding + top spacing
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none">
      {/* Inner card: glassmorphic pill */}
      <header className="pointer-events-auto max-w-[1400px] mx-auto hidden md:flex items-center justify-between px-6 py-3 bg-black/30 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-xl">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tighter text-primary font-headline-lg flex-shrink-0"
          >
            CINEVIEW
          </Link>
          <nav className="flex gap-5 items-center">
            {NAV_LINKS.map(({ label, path }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className={`text-sm font-semibold transition-colors pb-0.5 ${
                    isActive
                      ? "text-primary border-b-2 border-primary"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-3 flex-1 justify-end max-w-lg ml-8">
          {/* Search */}
          <div className="flex-1">
            <TopbarSearch placeholder={placeholder} />
          </div>

          {/* Notification bell */}
          <button
            onClick={handleNotifications}
            title="Notifications"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white border border-transparent hover:border-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white border border-transparent hover:border-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Profile avatar */}
          {rightSlot || (
            <Link href="/profile" className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-primary/60 transition-all">
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[11px] font-black text-black">
                  AS
                </div>
              </div>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
