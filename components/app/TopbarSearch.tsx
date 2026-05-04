"use client";

import { useMemo, useState, useRef, useEffect } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trimmed = useMemo(() => query.trim(), [query]);

  function go() {
    if (!trimmed) return;
    router.push(`${targetPath}?q=${encodeURIComponent(trimmed)}`);
    setIsExpanded(false);
  }

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!query) setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center transition-all duration-500 ease-out h-11 ${
        isExpanded 
          ? "w-full bg-white/10 ring-1 ring-white/20 px-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)]" 
          : "w-11 justify-center cursor-pointer hover:bg-white/5 rounded-full border border-transparent hover:border-white/10"
      }`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <button 
        className={`flex items-center justify-center shrink-0 transition-transform ${isExpanded ? "mr-3 scale-110" : "scale-100"}`}
        onClick={(e) => {
          if (isExpanded) {
            e.stopPropagation();
            go();
          }
        }}
      >
        <SearchIcon className={`h-5 w-5 transition-colors ${isExpanded ? "text-primary" : "text-white/40"}`} />
      </button>

      {isExpanded && (
        <>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") go();
              if (e.key === "Escape") setIsExpanded(false);
            }}
            className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/25"
            placeholder={placeholder}
            aria-label="Search"
          />
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (query) {
                setQuery("");
              } else {
                setIsExpanded(false);
              }
            }}
            className="ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">{query ? "backspace" : "close"}</span>
          </button>
        </>
      )}
    </div>
  );
}
