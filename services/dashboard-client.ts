import type { ApiResult } from "@/types/api";
import { getApi } from "@/services/api-client";
import { getAccessToken } from "@/lib/auth-session";
import type { DashboardPayload } from "@/types/content";

function formatCompactNumber(n: number): string {
  if (!n) return "0";
  const abs = Math.abs(n);
  if (abs < 1000) return String(n);
  const units: Array<[number, string]> = [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (const [div, suf] of units) {
    if (abs >= div) {
      const v = n / div;
      const digits = abs >= div * 100 ? 0 : 1;
      const text = v.toFixed(digits).replace(/\.0$/, "");
      return `${text}${suf}`;
    }
  }
  return String(n);
}

export async function getDashboardData(): Promise<ApiResult<DashboardPayload>> {
  const token = getAccessToken();
  if (!token) {
    return { ok: false, error: { code: "unauthorized", message: "Please log in." } };
  }

  const res = await getApi<any>("/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return res;

  const data = res.data;

  // The backend currently returns { stats: { totalViews, totalLikes, totalVideos }, videos: [] }
  // We need to map this to DashboardPayload: { user, stats: [], recentHistory: [] }

  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "").replace(/\/+$/, "");

  // Try to grab user info from localStorage since backend doesn't return it yet
  let userStr = null;
  if (typeof window !== "undefined") {
    userStr = window.localStorage.getItem("streamhub.auth.user");
  }
  const user = userStr ? JSON.parse(userStr) : null;

  const mappedStats = [
    {
      id: "views",
      label: "Total Video Views",
      value: formatCompactNumber(data.stats?.totalViews || 0),
      deltaLabel: "All time",
    },
    {
      id: "engagement",
      label: "Total Likes",
      value: formatCompactNumber(data.stats?.totalLikes || 0),
      deltaLabel: "All time",
    },
    {
      id: "videos",
      label: "Total Videos",
      value: formatCompactNumber(data.stats?.totalVideos || 0),
      deltaLabel: "Uploaded",
    },
  ];

  const recentHistory = (data.videos || []).slice(0, 5).map((v: any) => ({
    id: String(v.id),
    title: v.title || "Untitled",
    meta: `${v.status === "ready" ? "Ready" : "Processing"} • ${formatCompactNumber(v.views || 0)} views`,
    thumbnailUrl: v.thumbnailPath
      ? `${API_BASE}/videos/play/hls/${encodeURIComponent(v.thumbnailPath)}` // fallback or just proxy
      : "/demo/thumbs/thumb-01.svg",
    progress: 0,
    status: v.status,
  }));

  return {
    ok: true,
    data: {
      user: {
        name: user?.name || "Creator",
        handle: user?.email ? `@${user.email.split("@")[0]}` : "@creator",
        avatarUrl: "/demo/avatars/avatar-01.svg",
        planName: "StreamHub Pro",
      },
      stats: mappedStats,
      recentHistory,
    },
  };
}
