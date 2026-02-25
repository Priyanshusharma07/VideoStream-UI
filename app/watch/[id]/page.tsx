import Link from "next/link";
import Image from "next/image";
import { AppTopbar } from "@/components/app/AppTopbar";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { VideoThumb } from "@/components/content/VideoThumb";
import { ChatPanel } from "@/components/watch/ChatPanel";
import { WatchActions } from "@/components/watch/WatchActions";
import { VideoDescription } from "@/components/watch/VideoDescription";
import { getDemoVideoDetails } from "@/lib/demo/content";

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const details = getDemoVideoDetails(id);
  const v = details.video;

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 pt-6">
        <Link href="/" className="flex items-center gap-3">
          <StreamHubLogo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
          <Link href="/feed" className="hover:text-white">
            Browse
          </Link>
          <Link href="/discover" className="hover:text-white">
            Categories
          </Link>
          <Link href="/feed" className="hover:text-white">
            Following
          </Link>
        </nav>
        <div className="w-[520px] max-w-[50vw]">
          <AppTopbar
            placeholder="Search creators, games, videos..."
            rightSlot={
              <Image
                src="/demo/avatars/avatar-03.svg"
                alt="Profile"
                width={36}
                height={36}
                className="rounded-xl ring-1 ring-white/10"
              />
            }
          />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1400px] gap-6 px-6 pb-14 pt-8 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="aspect-video">
            <VideoThumb video={v} className="h-full" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight">{v.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span>{v.viewsLabel}</span>
            <span>•</span>
            <span>{v.uploadedLabel}</span>
            <span>•</span>
            <span>{v.category}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {v.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/65 ring-1 ring-white/10"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <Image
                src={v.creator.avatarUrl}
                alt={v.creator.name}
                width={44}
                height={44}
                className="rounded-xl ring-1 ring-white/10"
              />
              <div>
                <div className="text-sm font-semibold text-white/90">
                  {v.creator.name}
                </div>
                <div className="text-xs text-white/45">
                  {v.kind === "live" ? "Live streaming" : "New upload"}
                </div>
              </div>
            </div>

            <WatchActions creatorName={v.creator.name} />
          </div>

          <VideoDescription text={v.description} />
        </section>

        <div className="h-[calc(100vh-160px)] min-h-[560px]">
          <ChatPanel
            initialMessages={details.chat.messages}
            viewersLabel={details.chat.viewersLabel}
          />
        </div>
      </main>
    </div>
  );
}
