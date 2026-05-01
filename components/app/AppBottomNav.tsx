"use client";

import Link from "next/link";

export function AppBottomNav({ activePath }: { activePath: string }) {
  const items = [
    { icon: "home", label: "Home", path: "/" },
    { icon: "explore", label: "Browse", path: "/explore" },
    { icon: "add_circle", label: "Upload", path: "/upload" },
    { icon: "dashboard", label: "Library", path: "/dashboard" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-6 items-center justify-center bg-white/5 backdrop-blur-2xl w-auto min-w-[320px] rounded-[2rem] border border-white/10 px-6 py-3 shadow-2xl lg:hidden">
      {items.map((item) => {
        const isActive = activePath === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${
              isActive 
                ? "text-primary scale-110" 
                : "text-white/40 hover:text-white"
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-manrope text-[9px] uppercase font-black tracking-widest mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

