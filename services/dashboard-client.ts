import type { ApiResult } from "@/types/api";
import { getApi } from "@/services/api-client";
import { getAccessToken } from "@/lib/auth-session";
import type { DashboardPayload } from "@/types/content";

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

  // Try to grab user info from localStorage
  let userStr = null;
  if (typeof window !== "undefined") {
    userStr = window.localStorage.getItem("streamhub.auth.user");
  }
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    ok: true,
    data: {
      user: {
        name: user?.name || "Creator",
        handle: user?.email ? `@${user.email.split("@")[0]}` : "@creator",
        avatarUrl: user?.avatarUrl || "/demo/avatars/avatar-01.svg",
        planName: "CINEVIEW Creator",
      },
      stats: {
        totalViews: data.stats?.totalViews || "0",
        totalLikes: data.stats?.totalLikes || "0",
        totalVideos: data.stats?.totalVideos || 0,
      },
      videos: data.videos || [],
    },
  };
}
