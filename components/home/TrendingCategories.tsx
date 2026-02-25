"use client";

import Link from "next/link";
import { useRef } from "react";
import type { HomeCategory } from "@/lib/home-data";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

function CategoryCard({ category }: { category: HomeCategory }) {
  const { from, to } = category.image;
  return (
    <Link
      href={`/explore?q=${encodeURIComponent(category.label)}`}
      className="group relative h-20 w-44 shrink-0 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:ring-white/20"
      aria-label={`Explore ${category.label}`}
    >
      <div
        className="absolute inset-0 opacity-60 transition group-hover:opacity-80"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/0" />
      <div className="absolute bottom-2 left-3 text-xs font-semibold tracking-[0.18em] text-white/90">
        {category.label}
      </div>
    </Link>
  );
}

export function TrendingCategories({ categories }: { categories: HomeCategory[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  function scrollBy(delta: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-[0.22em] text-white/45">
          TRENDING CATEGORIES
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
            aria-label="Scroll categories left"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
            aria-label="Scroll categories right"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
