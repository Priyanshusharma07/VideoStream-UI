import { BookmarkIcon } from "@/components/icons";
import { WatchlistClient } from "@/app/watchlist/WatchlistClient";

export default function WatchlistPage() {
  return (
    <div className="py-12 px-[5vw]">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <BookmarkIcon className="h-8 w-8 text-primary" />
          My Watchlist
        </h1>
        <p className="mt-2 text-white/50 font-medium">
          Your curated collection of cinematic stories.
        </p>
      </div>

      <WatchlistClient />
    </div>
  );
}

