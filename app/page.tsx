"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CATEGORIES = [
  { label: "All Trending", slug: "all" },
  { label: "Cinema", slug: "cinema" },
  { label: "Gaming", slug: "gaming" },
  { label: "Music", slug: "music" },
  { label: "Technology", slug: "technology" },
  { label: "Documentaries", slug: "documentaries" },
  { label: "Sports", slug: "sports" },
  { label: "Animation", slug: "animation" },
];

const BENTO_SECONDARY = [
  {
    id: "echoes-of-sound",
    title: "Echoes of Sound",
    subtitle: "Live Music Session",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEbLx0IgIDE0riSZIC6YpTea-WnILUwXmIxCt7x6vuZqk4vhPeLu8ndIM77JnOGwE2iVkipOLMjyEmjjmLF3yk-qOjcuqyvEEA-CY4XqE9dxSBYZyFAlvYvmksHuawgkK0aIUufu5YfDn8Ksf2oV4Xni1RmflhH3VA-yL30tV75CvFwTVnvXtH4N0PaRk90QNeCSLUBHn_mYufce12m_zxi0byRHOESWpvG3I5dkGplHYc14sPghCMu9BOOmzwtQQ-I50TnpEVIoJy",
  },
  {
    id: "vision-pro-review",
    title: "Vision Pro Review",
    subtitle: "Tech Frontiers",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPMlG8ldddBaqCjLWShoZnVr8t3nWE90vdMdGajeHyJzKvdFOCrMDNh0nVYK5yNIU8d9vEwT-0ZXTzbLZNUzH9Z3LDAx-aX0U_X4JAakey6t9jDlHAAkcW1UIQA3f_jnJHXSpx949OcH1LoDEicMTYjFHxu6p_wkq37Jeabac4sP8SvL1s46VEyXkHO910ZnSHfbcgBFH-TChbqD32dvAYDVYe6e7yoyx6CLyrKr4sGm90Wwz9sId9dANoN2Xy1ltkcWjGg2TGCvpL",
  },
];

const NEW_AND_NOTABLE = [
  {
    id: "cosmic-paradox",
    title: "Cosmic Paradox",
    genre: "2024 • Sci-Fi Thriller",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvqEiaQ1OzUevZ4ja116O_14hhes2LIlQdQIYCoH3BHuhshBjAn5eo9fYfU3WtnjGAUN90LoQeUMDdALvl7ZrtFokdjX82dQIqJHQcm3RK09cxjrfO1B-x8GgNhVv00kQd5PVWO3YZaCbSecq71gQZwF9GtlXSUJUqF1YNOP-2FZRX0bpyKlosvP8WGJNCpdKvAIcNPCzFT3ugOu3PryZIoc-56VPYsE0JQx8tKcKTdl59JoDp0h45_sS8wjmzKQSBAcvMwp5hsKY1",
    badge: "4K",
  },
  {
    id: "urban-legends",
    title: "Urban Legends",
    genre: "8 episodes • Documentary",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq7OePHDBguyOmA-Mf_7EWokmEU5t_2h6AGSaLEgO5lyV__I6-z0Wv2dubBv9RlpztcY-vEtCf6URUMcacYyxIAJOl1T9q8i0vuXnsZxqWqePIOJ-BgoPdkZ68ji6AVHRhKKlloLfbeeUbMW8DZT_45wkkVv1kqmxONNKiWOOEmzhXAmN_ilpi9wRf7dx-sE9gnIiXY_3xi14NjJQBVCoQDo79kwf0DCV66MezT75pUVxGO7eo9yFJxVSNttPsf7NdaEWPAEKetZc5",
    progress: 50,
  },
  {
    id: "the-abyss-below",
    title: "The Abyss Below",
    genre: "2023 • Nature",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz1c7lsqs6jyYEQLy-Qy-NNAJD8HwDY1hCSEw7i_w48s7wnjLz5NHeFSlYRwtBGmegjxUXGpSsAJN02BdnlyTC3rqbeu0Yv82bhIzMbhy2TBG7QqEyJvz3Vrm6tClzfErzBa8xuLV9FzmN8hvqaqPSvbC9vBqZJcNHc3jxYaC729Dgv5G7EHFMCkjVPEooaZ6jZcVXLKKAMZlnhV0ASIlNEybLmUnhGk8XmFI8_Yvtg1dy1ENT8UofcZcY1ZptJ9zsciglO-Wtun-g",
  },
  {
    id: "digital-flow",
    title: "Digital Flow",
    genre: "Creative • Live Art",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBI5Hqf1MwVNQwTcwdsmn7lzYdAxYccaAGN4OthS1GYFt-HOtKhnEPcKj7VY2AdO_GNxnVlT_cYdrpah2umJgRZPB5VpCrWyizvHtY6lVNLQvZIADDvPW3Stm_VZ4RAty4vvjb-eNhmjwh-wy4hl-yW-NacBdAIMGnC9ZaqYwxUp11dbU0nWZJDPKCNyVl4r0gvTHV_P50NeAUe_YlH6VsXaQE6QnGTWm6HKqPjsahIfqJm6WAPcI6qVhCC1AqMifPmJhI09N4l5CBV",
    isLive: true,
  },
  {
    id: "peak-performance",
    title: "Peak Performance",
    genre: "Series • Sports",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoSb6ntXKGLMhgyl4LIaWN4fvAK_BNeuzMb4r8hOiDXnNVabuZofZUT0FX3ByvszRLoRhxd8pSNCw1lm_Ena5VcS3380quMsd-NOylM7eVfHMx1BRzgTmPFgjTg5oZg40Cpc6cMrR42EpozQVCNY-9EfjVnzFQPQ6R4cCoc1Y93TOlDAK3zSlykAoEeSjXJ3POX5tJBgImoyKVhv3qfRF38euu6J3NBtAB_xXZ-w1OCw00Bv2Pj4msDhJk3HBPDjLdcAUyV9eaTK_q",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const router = useRouter();

  const handleWatchTrailer = () => {
    router.push("/watch/neon-dreams-rebirth");
  };

  const handleAddToWatchlist = () => {
    router.push("/watchlist");
  };

  return (
    <div className="min-h-screen pb-32 px-[5vw]">
      {/* ─── Hero Trending Section ─── */}
      <section className="mb-8 relative rounded-3xl overflow-hidden glass-border aspect-[21/9] min-h-[320px]">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            className="object-cover"
            alt="Neon Dreams: The Rebirth"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBImcS2ra2sZ_z9H_4F3sIz9YUbAMkeWq8uNn9hGnCEA0Qvsr0eV6DKiqsLLZv69SSM3BkphZq0dVxrYbjJr0c3YCiDla8adCYi_EkcqsOZnMDXWv56z3tsCKy0uexvXwLJr9TJxKtzDe7MoqnkTgQN23fAO9bydJd_FHTYVK3eBPAkY1MFh5rR-D22G2GwF1RZmsRvxpI_zWPL631yK3Q5eEKl6lslwzRSIKNN1qC6NAj-zYoN55e1p3JJhIWHJwJZc00GIU-oSXVN"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 p-6 md:p-12 z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#FF0055]/20 text-[#FF506E] px-3 py-1 rounded-full text-[11px] uppercase font-black border border-[#FF0055]/30 flex items-center gap-1.5 animate-pulse">
              <span className="material-symbols-outlined text-[13px]">sensors</span>
              Live Now
            </span>
            <span className="text-white/50 text-[11px] uppercase tracking-widest font-semibold">
              Trending Cinema
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tighter">
            NEON DREAMS: THE REBIRTH
          </h1>
          <p className="text-white/60 text-base md:text-lg mb-8 line-clamp-2 leading-relaxed">
            Experience the ground-breaking visual masterpiece that redefined 21st-century sci-fi.
            Now streaming in Ultra HD with immersive spatial audio.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleWatchTrailer}
              className="bg-primary-container text-white px-7 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary-container/30"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              Watch Trailer
            </button>
            <button
              onClick={handleAddToWatchlist}
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-7 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-white/20 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Watchlist
            </button>
          </div>
        </div>
      </section>

      {/* ─── Tag Filters ─── */}
      <section className="mb-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map(({ label, slug }) => (
            <button
              key={slug}
              onClick={() => {
                setActiveCategory(slug);
                if (slug !== "all") {
                  router.push(`/explore?cat=${slug}`);
                }
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === slug
                  ? "bg-primary-container text-white shadow-[0_0_12px_rgba(0,102,255,0.4)]"
                  : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Bento Grid Discovery ─── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-white">
          <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
          Top Picks for You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[560px]">
          {/* Main large card — col-span-2, row-span-2 */}
          <Link
            href="/watch/league-finals"
            className="md:col-span-2 md:row-span-2 relative group rounded-2xl overflow-hidden glass-border block md:row-start-1 md:row-end-3"
          >
            <Image
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf2xaEUL1URDpOH84lNh1Ky_bLz8GXnX9rIw-rhu6afxRfNs3V---ItIUZ1in8eiO-HEqhGMqb6TYTW_tlvsfD3piJ17ZiZgI6D45MkZZ-xiqySvuuH_io33QtTy1Vo8rbn6cU4117ea71hr86GVDAhMrETqejGVYk44ThecNhpjKkZVMKs_i396i1Axvfz3nFBZSvWx8EdFPnwJsu37f23aykP2HfRMfdtq9Kemfgb8b8UBDAxVOHzVUWUcfnfC_LdGokpQkXb8Z-"
              alt="League Finals"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2 block">
                Premium Gaming
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                League Finals: Path to Glory
              </h3>
              <div className="flex items-center gap-4 text-slate-300 text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">visibility</span>
                  1.2M watching
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  2h remaining
                </span>
              </div>
            </div>
          </Link>

          {/* Secondary top cards */}
          {BENTO_SECONDARY.map(({ id, title, subtitle, img }) => (
            <Link
              key={id}
              href={`/watch/${id}`}
              className="relative group rounded-2xl overflow-hidden glass-border min-h-[180px] md:min-h-0 block"
            >
              <Image
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                src={img}
                alt={title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="text-base font-bold text-white mb-0.5">{title}</h3>
                <p className="text-slate-400 text-xs">{subtitle}</p>
              </div>
            </Link>
          ))}

          {/* Wide bottom card */}
          <Link
            href="/watch/earth-uncharted"
            className="md:col-span-2 relative group rounded-2xl overflow-hidden glass-border min-h-[200px] md:min-h-0 block"
          >
            <Image
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTgl8vtKT2r6ECXXypsr-1A4w6LJnVVYCIgAVS9MNCvym0D2_CUlCULF5dAuMMXMrr5aXsGRIh25vYNsVGf-siyzNRgZRTHzsVtJDPYfyrhBSFq3xxUa9wxzo6nYSTC_lJgmVo9YvWAuLwvQurLBhqeujbvZVynsz7BXWyjfHIVWh8xWrMHm1t7DqL99JG7efFsvT6VWxgR2BU_3x85H3nE_gizmHH6VKVVlA_hd2TqJjKT_yTyJuVRZrPrFMOkMcFsv_aOVg0vsQm"
              alt="Earth: Uncharted"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 flex justify-between items-end w-full">
              <div>
                <h3 className="text-lg font-bold text-white mb-0.5">Earth: Uncharted</h3>
                <p className="text-slate-400 text-xs">Full Documentary Series</p>
              </div>
              {/* Progress bar */}
              <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary-container" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── New & Notable ─── */}
      <section className="pb-4">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white">New & Notable</h2>
          <Link
            href="/explore"
            className="text-primary text-sm font-bold flex items-center gap-1 group hover:underline"
          >
            View all
            <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {NEW_AND_NOTABLE.map((item) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="flex flex-col gap-2 group"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden glass-border shadow-lg group-hover:scale-[1.03] group-hover:ring-2 ring-white/20 transition-all duration-300">
                <Image
                  fill
                  className="object-cover"
                  src={item.img}
                  alt={item.title}
                />
                {item.badge && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white">
                    {item.badge}
                  </div>
                )}
                {item.isLive && (
                  <div className="absolute top-2 left-2 bg-[#FF0055] px-2 py-0.5 rounded text-[10px] font-black text-white flex items-center gap-1 shadow-lg">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                )}
                {item.progress && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
                    <div
                      className="h-full bg-primary-container"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-white group-hover:text-primary transition-colors text-sm leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
