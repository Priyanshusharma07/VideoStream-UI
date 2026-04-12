"use client";

import Link from "next/link";
import { BellIcon, PlusIcon } from "@/components/icons";
import { TopbarSearch } from "./TopbarSearch";

export function AppTopbar({
  placeholder = "Search...",
}: {
  placeholder?: string;
  rightSlot?: React.ReactNode; // kept for back-compat
}) {
  return (
    <div className="flex items-center gap-3">
      {/* Search — takes up all remaining space */}
      <div className="flex-1 max-w-[560px]">
        <TopbarSearch placeholder={placeholder} />
      </div>

      {/* Actions */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {/* Upload shortcut */}
        <Link
          href="/upload"
          className="flex h-9 items-center gap-2 rounded-xl bg-sky-500 px-4 text-xs font-bold text-black transition hover:bg-sky-400 active:scale-95"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="hidden sm:block">Upload</span>
        </Link>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60 ring-1 ring-white/8 transition hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <BellIcon className="h-4.5 w-4.5" />
        </Link>
      </div>
    </div>
  );
}
