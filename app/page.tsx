import Link from "next/link";
import { HomeHeader } from "@/components/home/HomeHeader";
import { TrendingCategories } from "@/components/home/TrendingCategories";
import { PlayIcon } from "@/components/icons";
import { HOME_CATEGORIES } from "@/lib/home-data";
import { HeroSearch } from "@/components/home/HeroSearch";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-28 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-[-6rem] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-32 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-purple-600/12 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/55" />
      </div>

      <HomeHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-12 pt-12">
        <Link
          href="/watch/v-1"
          aria-label="Play trailer"
          className="group relative mb-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15 hover:ring-white/25"
        >
          <span className="absolute inset-0 rounded-full shadow-[0_0_0_6px_rgba(255,255,255,0.04)] transition group-hover:shadow-[0_0_0_10px_rgba(255,255,255,0.05)]" />
          <PlayIcon className="h-6 w-6 translate-x-[1px] text-white/85" />
        </Link>

        <h1 className="text-center text-5xl font-extrabold tracking-[0.18em] sm:text-6xl md:text-7xl">
          <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-purple-500 bg-clip-text text-transparent">
            STREAM LIMITLESS
          </span>
        </h1>

        <div className="mt-10 w-full max-w-xl">
          <HeroSearch />
        </div>
      </main>

      <TrendingCategories categories={HOME_CATEGORIES} />
    </div>
  );
}
