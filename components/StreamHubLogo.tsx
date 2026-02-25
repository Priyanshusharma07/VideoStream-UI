import { StreamHubMark } from "./icons";

export function StreamHubLogo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <StreamHubMark className="h-6 w-6" />
      <span className="text-sm font-semibold tracking-[0.2em] text-white/90">
        STREAMHUB
      </span>
    </div>
  );
}

