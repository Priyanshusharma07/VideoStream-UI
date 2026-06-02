import Link from "next/link";

/**
 * CineView Logo — full wordmark with icon mark
 */
export function CineViewLogo({
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
      {/* Icon mark */}
      <div
        className={`${iconSize} relative flex shrink-0 items-center justify-center rounded-lg shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform`}
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ff0055', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#b3003b', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M85,50 C85,69.33 69.33,85 50,85 C30.67,85 15,69.33 15,50 C15,30.67 30.67,15 50,15 L50,28 C37.85,28 28,37.85 28,50 C28,62.15 37.85,72 50,72 C62.15,72 72,62.15 72,50 L85,50 Z" fill="url(#brandGradient)" />
          <path d="M45,35 L65,50 L45,65 Z" fill="white" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`${textSize} font-black tracking-tight text-white group-hover:text-white/90 transition-colors uppercase`}
        >
          Cine<span className="text-primary">View</span>
        </span>
        <span className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase mt-px">
          Cinematic
        </span>
      </div>
    </Link>
  );
}

