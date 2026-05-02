"use client";

import Link from "next/link";

const NAV_ITEMS = [
  { icon: "home", label: "Home", path: "/" },
  { icon: "explore", label: "Explore", path: "/explore" },
  { icon: "add_circle", label: "Create", path: "/upload", isCTA: true },
  { icon: "sensors", label: "Live", path: "/live" },
  { icon: "person", label: "Profile", path: "/profile" },
];

export function AppBottomNav({ activePath }: { activePath: string }) {
  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center gap-1 px-3 py-2 bg-black/60 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.7)]">
        {NAV_ITEMS.map((item) => {
          const isActive = activePath === item.path;

          if (item.isCTA) {
            return (
              <Link
                key={item.path}
                href={item.path}
                aria-label={item.label}
                className="mx-1 w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/30 hover:bg-blue-600 active:scale-90 transition-all"
              >
                <span
                  className="material-symbols-outlined text-white text-[26px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  add_circle
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70 active:scale-90"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-wider leading-none transition-colors ${
                isActive ? "text-white" : "text-white/30"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
