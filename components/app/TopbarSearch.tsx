"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons";

export function TopbarSearch({
  placeholder,
  targetPath = "/explore",
}: {
  placeholder: string;
  targetPath?: string;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const trimmed = useMemo(() => query.trim(), [query]);

  function go() {
    if (!trimmed) return;
    router.push(`${targetPath}?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
      <SearchIcon className="h-5 w-5 text-white/40" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") go();
        }}
        className="w-full bg-transparent text-sm text-white/85 outline-none placeholder:text-white/35"
        placeholder={placeholder}
        aria-label="Search"
      />
    </div>
  );
}

