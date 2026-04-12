import Link from "next/link";

/**
 * StreamHub Logo — full wordmark with icon mark
 * size: "sm" | "md" (default md)
 */
export function StreamHubLogo({
  href = "/feed",
  size = "md",
}: {
  href?: string;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const textSize = size === "sm" ? "text-sm" : "text-[15px]";

  return (
    <Link href={href} className="group flex items-center gap-2.5 select-none">
      {/* Icon mark — hexagonal play button */}
      <div
        className={`${iconSize} relative flex shrink-0 items-center justify-center`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          {/* Glow blur layer */}
          <defs>
            <radialGradient id="sh-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sh-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Background pill */}
          <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#sh-bg)" />
          {/* Subtle inner glow */}
          <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#sh-glow)" />
          {/* Play triangle */}
          <path d="M13 10.5v11a1 1 0 0 0 1.53.848l9-5.5a1 1 0 0 0 0-1.696l-9-5.5A1 1 0 0 0 13 10.5Z" fill="white" fillOpacity="0.95" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`${textSize} font-bold tracking-tight text-white group-hover:text-white/90 transition-colors`}
        >
          Stream<span className="text-sky-400">Hub</span>
        </span>
        <span className="text-[9px] font-semibold tracking-[0.25em] text-white/30 uppercase mt-px">
          Platform
        </span>
      </div>
    </Link>
  );
}
