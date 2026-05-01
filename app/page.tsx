import Link from "next/link";
import { getVideos } from "@/src/services/videoService";
import { videoCategories } from "@/src/data/mockVideos";
import { VideoCard } from "@/components/video/VideoCard";


export const dynamic = "force-dynamic";

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="px-[5vw] py-10">
      {/* Hero Section */}
      <section className="mb-12 relative rounded-[2.5rem] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <img 
          src="/demo/thumbs/thumb-01.svg" 
          alt="Featured" 
          className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 max-w-2xl">
          <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-[10px] font-black w-fit mb-4 backdrop-blur-md border border-primary/20 tracking-widest">
            FEATURED COLLECTION
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter text-glow">
            Discover the Future of <span className="text-primary">Cinema</span>
          </h1>
          <p className="text-base text-white/70 mb-8 font-medium">
            Explore thousands of award-winning movies, series, and live streams from top creators worldwide.
          </p>
          <div className="flex gap-4">
            <Link href={`/watch/${videos[0]?.id || ''}`} className="bg-primary text-black px-8 py-3 rounded-2xl font-black hover:brightness-110 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">play_arrow</span>
              Start Watching
            </Link>
            <Link href="/explore" className="bg-white/5 text-white px-8 py-3 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-md border border-white/10">
              Browse All
            </Link>
          </div>

        </div>
      </section>


      {/* Categories Scroller */}
      <div className="mb-12 flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
        {videoCategories.map((c) => (
          <button
            key={c}
            className="whitespace-nowrap px-6 py-2.5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all text-sm font-semibold text-white/80"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Trending Now</h2>
            <p className="text-white/50 mt-1">Handpicked for you based on your interests</p>
          </div>
          <button className="text-primary font-bold hover:underline flex items-center gap-1">
            See all <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </div>
  );
}

