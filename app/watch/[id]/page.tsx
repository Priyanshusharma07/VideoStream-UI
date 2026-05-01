import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatPanel } from "@/components/watch/ChatPanel";
import { WatchActions } from "@/components/watch/WatchActions";
import { VideoDescription } from "@/components/watch/VideoDescription";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { getVideoDetails, recordView } from "@/services/videos-client";
import { CreatorActions } from "@/components/watch/CreatorActions";


export const dynamic = "force-dynamic";

function apiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE?.trim();
  return raw ? raw.replace(/\/+$/, "") : "";
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const result = await getVideoDetails(id);
  if (!result.ok) {
    if (result.error.code === "not_found") notFound();
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-on-surface">
        <div className="text-center glass-panel p-12 rounded-[2rem]">
          <span className="material-symbols-outlined text-6xl text-primary mb-4">error</span>
          <p className="text-2xl font-bold text-white/90">Failed to load video</p>
          <p className="mt-2 text-white/45 max-w-xs mx-auto">{result.error.message}</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-on-primary hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined">home</span>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { video: v, chat, playback } = result.data;
  void recordView(id);
  const base = apiBase();

  return (
    <div className="px-6 py-8 mx-auto w-full max-w-[1600px]">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left: player + meta */}
        <section>
          {/* Player Wrapper */}
          <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 relative group">
             <VideoPlayer
              videoId={id}
              initialStatus={playback.status}
              initialHlsPath={playback.hlsManifestPath ?? null}
              apiBase={base}
              poster={v.thumbnailUrl ?? undefined}
            />
          </div>

          {/* Video Info Card */}
          <div className="mt-8 glass-panel p-8 rounded-[2rem]">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-black tracking-tighter text-white mb-2 leading-tight">
                  {v.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/50">
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    {v.viewsLabel}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    {v.uploadedLabel}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full text-primary">
                    <span className="material-symbols-outlined text-sm">category</span>
                    {v.category}
                  </span>
                </div>
              </div>
              
              <WatchActions
                videoId={id}
                creatorName={v.creator.name}
                initialLikesLabel={v.likesLabel}
              />
            </div>

            {/* Tags */}
            {v.tags && v.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/5 pt-6">
                {v.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-xl bg-white/5 px-4 py-1.5 text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-default"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Creator & Description Row */}
          <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
             <div className="glass-panel p-6 rounded-[2rem] h-fit">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-lg font-black text-white shadow-lg ring-1 ring-white/20">
                    {(v.creator.name ?? "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white leading-tight">
                      {v.creator.name}
                    </div>
                    <div className="text-xs text-white/40 font-medium">
                      {v.kind === "live" ? "🔴 Live Now" : "Official Creator"}
                    </div>
                  </div>
                </div>
                <CreatorActions creatorName={v.creator.name} />
             </div>


             <div className="glass-panel p-8 rounded-[2rem]">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Description
                </h3>
                <VideoDescription text={v.description} />
             </div>
          </div>
        </section>

        {/* Right: Chat / Sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="glass-panel rounded-[2rem] overflow-hidden flex flex-col h-[750px]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <span className="material-symbols-outlined text-secondary">chat_bubble</span>
                 Live Chat
               </h3>
               <div className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold border border-secondary/20">
                 {chat.viewersLabel}
               </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatPanel
                initialMessages={chat.messages}
                viewersLabel={chat.viewersLabel}
              />
            </div>
          </div>
          
          {/* Recommendation placeholder */}
          <div className="mt-8 glass-panel p-6 rounded-[2rem]">
            <h3 className="text-white font-bold mb-4">Up Next</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 group cursor-pointer">
                  <div className="w-32 h-20 rounded-xl bg-white/5 overflow-hidden shrink-0">
                    <img src={`/demo/thumbs/thumb-0${i}.svg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Rec" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white/90 line-clamp-2 leading-tight">Recommended Video Title {i}</h4>
                    <p className="text-xs text-white/40 mt-1">Channel Name</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

