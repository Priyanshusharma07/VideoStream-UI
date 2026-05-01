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
        className={`${iconSize} relative flex shrink-0 items-center justify-center bg-primary rounded-lg shadow-lg shadow-primary/20`}
        aria-hidden="true"
      >
        <span className="material-symbols-outlined text-black font-bold text-xl">play_arrow</span>
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

