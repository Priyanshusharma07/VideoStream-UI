"use client";

import { useMemo, useState } from "react";

export function VideoDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  const normalized = text.trim();
  const preview = useMemo(() => {
    if (normalized.length <= 180) return normalized;
    return `${normalized.slice(0, 180)}…`;
  }, [normalized]);

  const showToggle = normalized.length > 180;

  return (
    <div className="mt-5 rounded-2xl bg-black/35 p-5 ring-1 ring-white/10 backdrop-blur">
      <p className="text-sm text-white/70">{expanded ? normalized : preview}</p>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-xs text-cyan-300 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}

