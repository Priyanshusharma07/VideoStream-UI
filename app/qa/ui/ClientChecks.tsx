"use client";

import { useEffect, useMemo, useState } from "react";
import { getVideoById, getVideos, getLiveVideos } from "@/src/services/videoService";

type Status = "pending" | "ok" | "error";

type CheckItem = {
  id: string;
  label: string;
  run: () => Promise<void>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

async function expectOkJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  const json = (await res.json().catch(() => null)) as unknown;
  if (!isRecord(json)) throw new Error(`Bad JSON from ${url}`);
  if (typeof json.ok !== "boolean") throw new Error(`Missing ok from ${url}`);
  if (json.ok !== true) throw new Error(`ok=false from ${url}`);
}

export function ClientChecks() {
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  const checks = useMemo<CheckItem[]>(
    () => [
      {
        id: "videos_count",
        label: "Mock videos load (>= 10)",
        run: async () => {
          const videos = await getVideos();
          if (videos.length < 10) throw new Error(`Expected >=10, got ${videos.length}`);
        },
      },
      {
        id: "live_count",
        label: "Live videos load (>= 1)",
        run: async () => {
          const live = await getLiveVideos();
          if (live.length < 1) throw new Error(`Expected >=1, got ${live.length}`);
        },
      },
      {
        id: "video_by_id",
        label: "getVideoById works",
        run: async () => {
          const v = await getVideoById("edu-nextjs-app-router");
          if (!v) throw new Error("Video not found");
        },
      },
      {
        id: "api_health",
        label: "/api/health responds",
        run: async () => {
          const res = await fetch("/api/health", { cache: "no-store" });
          const json = (await res.json().catch(() => null)) as unknown;
          if (!isRecord(json)) throw new Error("Bad JSON");
          if (json.ok !== true) throw new Error("Health not ok");
        },
      },
      {
        id: "api_feed",
        label: "/api/feed ok=true",
        run: async () => expectOkJson("/api/feed"),
      },
      {
        id: "api_video",
        label: "/api/videos/v-1 ok=true",
        run: async () => expectOkJson("/api/videos/v-1"),
      },
      {
        id: "api_status",
        label: "/api/videos/v-1/status ok=true",
        run: async () => expectOkJson("/api/videos/v-1/status"),
      },
      {
        id: "api_search",
        label: "/api/search?q=cy ok=true",
        run: async () => expectOkJson("/api/search?q=cy"),
      },
      {
        id: "api_login",
        label: "Demo login works",
        run: async () => {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "demo@streamhub.com", password: "demo1234" }),
          });
          const json = (await res.json().catch(() => null)) as unknown;
          if (!isRecord(json) || json.ok !== true) throw new Error("Login failed");
        },
      },
    ],
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function runAll() {
      for (const c of checks) {
        if (cancelled) return;
        setStatus((s) => ({ ...s, [c.id]: "pending" }));
        setError((e) => ({ ...e, [c.id]: null }));
        try {
          await c.run();
          if (cancelled) return;
          setStatus((s) => ({ ...s, [c.id]: "ok" }));
        } catch (err) {
          const message = err instanceof Error ? err.message : "Check failed";
          if (cancelled) return;
          setStatus((s) => ({ ...s, [c.id]: "error" }));
          setError((e) => ({ ...e, [c.id]: message }));
        }
      }
    }

    void runAll();
    return () => {
      cancelled = true;
    };
  }, [checks]);

  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white/90">Smoke Checks</div>
          <div className="mt-1 text-xs text-white/55">
            Runs in the browser. If any fail, the affected pages might break.
          </div>
        </div>
        <div className="text-xs text-white/40">
          {checks.filter((c) => status[c.id] === "ok").length}/{checks.length} passed
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {checks.map((c) => {
          const s = status[c.id] ?? "pending";
          const message = error[c.id];
          return (
            <div
              key={c.id}
              className={[
                "rounded-xl px-4 py-3 ring-1",
                s === "ok"
                  ? "bg-emerald-500/10 ring-emerald-500/20"
                  : s === "error"
                    ? "bg-red-500/10 ring-red-500/20"
                    : "bg-black/20 ring-white/10",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-white/85">{c.label}</div>
                <div
                  className={[
                    "text-[10px] font-extrabold tracking-[0.18em]",
                    s === "ok"
                      ? "text-emerald-300"
                      : s === "error"
                        ? "text-red-300"
                        : "text-white/40",
                  ].join(" ")}
                >
                  {s === "ok" ? "PASS" : s === "error" ? "FAIL" : "RUN"}
                </div>
              </div>
              {s === "error" && message ? (
                <div className="mt-2 text-xs text-red-100/90">{message}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

