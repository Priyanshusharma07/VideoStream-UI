import Link from "next/link";
import { getLiveVideos } from "@/src/services/videoService";
import { VideoCard } from "@/components/video/VideoCard";

export const dynamic = "force-dynamic";

const LIVE_MOCK = [
  {
    id: "live-1", title: "League Finals: Path to Glory", category: "Gaming",
    viewerCount: "1.2M", duration: "2h remaining",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf2xaEUL1URDpOH84lNh1Ky_bLz8GXnX9rIw-rhu6afxRfNs3V---ItIUZ1in8eiO-HEqhGMqb6TYTW_tlvsfD3piJ17ZiZgI6D45MkZZ-xiqySvuuH_io33QtTy1Vo8rbn6cU4117ea71hr86GVDAhMrETqejGVYk44ThecNhpjKkZVMKs_i396i1Axvfz3nFBZSvWx8EdFPnwJsu37f23aykP2HfRMfdtq9Kemfgb8b8UBDAxVOHzVUWUcfnfC_LdGokpQkXb8Z-",
    avatarInitials: "LF", avatarColor: "from-purple-500 to-indigo-500",
  },
  {
    id: "live-2", title: "Echoes of Sound: Live Session", category: "Music",
    viewerCount: "245K", duration: "Ongoing",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEbLx0IgIDE0riSZIC6YpTea-WnILUwXmIxCt7x6vuZqk4vhPeLu8ndIM77JnOGwE2iVkipOLMjyEmjjmLF3yk-qOjcuqyvEEA-CY4XqE9dxSBYZyFAlvYvmksHuawgkK0aIUufu5YfDn8Ksf2oV4Xni1RmflhH3VA-yL30tV75CvFwTVnvXtH4N0PaRk90QNeCSLUBHn_mYufce12m_zxi0byRHOESWpvG3I5dkGplHYc14sPghCMu9BOOmzwtQQ-I50TnpEVIoJy",
    avatarInitials: "ES", avatarColor: "from-pink-500 to-rose-500",
  },
  {
    id: "live-3", title: "Digital Flow: Live Art Creation", category: "Creative",
    viewerCount: "88K", duration: "3h remaining",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBI5Hqf1MwVNQwTcwdsmn7lzYdAxYccaAGN4OthS1GYFt-HOtKhnEPcKj7VY2AdO_GNxnVlT_cYdrpah2umJgRZPB5VpCrWyizvHtY6lVNLQvZIADDvPW3Stm_VZ4RAty4vvjb-eNhmjwh-wy4hl-yW-NacBdAIMGnC9ZaqYwxUp11dbU0nWZJDPKCNyVl4r0gvTHV_P50NeAUe_YlH6VsXaQE6QnGTWm6HKqPjsahIfqJm6WAPcI6qVhCC1AqMifPmJhI09N4l5CBV",
    avatarInitials: "DF", avatarColor: "from-emerald-500 to-teal-500",
  },
  {
    id: "live-4", title: "Vision Pro: Full Unboxing + Review", category: "Technology",
    viewerCount: "560K", duration: "45 min remaining",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPMlG8ldddBaqCjLWShoZnVr8t3nWE90vdMdGajeHyJzKvdFOCrMDNh0nVYK5yNIU8d9vEwT-0ZXTzbLZNUzH9Z3LDAx-aX0U_X4JAakey6t9jDlHAAkcW1UIQA3f_jnJHXSpx949OcH1LoDEicMTYjFHxu6p_wkq37Jeabac4sP8SvL1s46VEyXkHO910ZnSHfbcgBFH-TChbqD32dvAYDVYe6e7yoyx6CLyrKr4sGm90Wwz9sId9dANoN2Xy1ltkcWjGg2TGCvpL",
    avatarInitials: "VP", avatarColor: "from-sky-500 to-blue-500",
  },
  {
    id: "live-5", title: "Peak Performance: Finals Day 3", category: "Sports",
    viewerCount: "3.1M", duration: "Live",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoSb6ntXKGLMhgyl4LIaWN4fvAK_BNeuzMb4r8hOiDXnNVabuZofZUT0FX3ByvszRLoRhxd8pSNCw1lm_Ena5VcS3380quMsd-NOylM7eVfHMx1BRzgTmPFgjTg5oZg40Cpc6cMrR42EpozQVCNY-9EfjVnzFQPQ6R4cCoc1Y93TOlDAK3zSlykAoEeSjXJ3POX5tJBgImoyKVhv3qfRF38euu6J3NBtAB_xXZ-w1OCw00Bv2Pj4msDhJk3HBPDjLdcAUyV9eaTK_q",
    avatarInitials: "PS", avatarColor: "from-orange-500 to-red-500",
  },
  {
    id: "live-6", title: "Cosmic Paradox: Director's Q&A", category: "Cinema",
    viewerCount: "120K", duration: "Starting soon",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvqEiaQ1OzUevZ4ja116O_14hhes2LIlQdQIYCoH3BHuhshBjAn5eo9fYfU3WtnjGAUN90LoQeUMDdALvl7ZrtFokdjX82dQIqJHQcm3RK09cxjrfO1B-x8GgNhVv00kQd5PVWO3YZaCbSecq71gQZwF9GtlXSUJUqF1YNOP-2FZRX0bpyKlosvP8WGJNCpdKvAIcNPCzFT3ugOu3PryZIoc-56VPYsE0JQx8tKcKTdl59JoDp0h45_sS8wjmzKQSBAcvMwp5hsKY1",
    avatarInitials: "CP", avatarColor: "from-violet-500 to-purple-500",
  },
];

export default async function LivePage() {
  // Try real API, fall back to rich mock data
  const liveResult = await getLiveVideos().catch(() => []);
  const hasRealData = Array.isArray(liveResult) && liveResult.length > 0;
  const totalStreams = hasRealData ? liveResult.length : LIVE_MOCK.length;

  return (
    <div className="min-h-screen pb-24">
      {/* ── Featured Live Hero ─────────────────────────────────────── */}
      <section className="relative px-[5vw] mb-8">
        <div className="relative rounded-3xl overflow-hidden h-[340px] md:h-[420px] glass-border">
          <img
            src={LIVE_MOCK[0].img}
            alt={LIVE_MOCK[0].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f]/80 via-transparent to-transparent" />

          {/* Live badge */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-[#FF0055] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE NOW
            </span>
            <span className="bg-black/50 backdrop-blur-md text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
              {LIVE_MOCK[0].category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 leading-tight">
              {LIVE_MOCK[0].title}
            </h1>
            <div className="flex items-center gap-4 mb-6 text-white/60 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                {LIVE_MOCK[0].viewerCount} watching
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                {LIVE_MOCK[0].duration}
              </span>
            </div>
            <Link
              href={`/watch/${LIVE_MOCK[0].id}`}
              className="inline-flex items-center gap-2 bg-[#FF0055] text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-[#e0004a] active:scale-95 transition-all shadow-lg shadow-[#FF0055]/30"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              Join Stream
            </Link>
          </div>
        </div>
      </section>

      {/* ── Header row ─────────────────────────────────────────────── */}
      <div className="px-[5vw] flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF0055] animate-pulse flex-shrink-0" />
            All Live Streams
          </h2>
          <p className="text-white/40 text-sm font-medium mt-0.5">{totalStreams} active right now</p>
        </div>
        <div className="flex items-center gap-2 bg-[#FF0055]/10 border border-[#FF0055]/20 px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#FF0055] animate-pulse" />
          <span className="text-[11px] font-black text-[#FF6080] uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* ── Stream Grid ─────────────────────────────────────────────── */}
      {hasRealData ? (
        <div className="px-[5vw] grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {liveResult.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      ) : (
        <div className="px-[5vw] grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LIVE_MOCK.slice(1).map((stream) => (
            <Link key={stream.id} href={`/watch/${stream.id}`} className="group relative rounded-2xl overflow-hidden glass-border block">
              <div className="aspect-video relative">
                <img src={stream.img} alt={stream.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Live badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#FF0055] text-white text-[10px] font-black px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>

                {/* Viewer count */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">visibility</span>
                  {stream.viewerCount}
                </div>

                {/* Play button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${stream.avatarColor} flex items-center justify-center text-white text-[10px] font-black flex-shrink-0`}>
                      {stream.avatarInitials}
                    </div>
                    <span className="text-white/60 text-xs font-medium">{stream.category}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {stream.title}
                  </h3>
                  <p className="text-white/40 text-[11px] font-medium mt-1">{stream.duration}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
