import type { ApiResult } from "@/types/api";
import { getApi, postApi } from "@/services/api-client";
import { getAccessToken } from "@/lib/auth-session";
import type { VideoStatusPayload, WatchPagePayload } from "@/types/watch";

function authHeaders(): HeadersInit | null {
  const token = getAccessToken();
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

function encodeVideoId(id: number | string) {
  return encodeURIComponent(String(id));
}

/**
 * Get full video details for the watch page.
 * The backend now returns a structured WatchPagePayload including video, chat, and playback info.
 */
export async function getVideoDetails(
  id: number | string,
): Promise<ApiResult<WatchPagePayload>> {
  return getApi<WatchPagePayload>(`/videos/${encodeVideoId(id)}`, {
    cache: "no-store",
  });
}

export async function pollVideoStatus(
  id: number | string,
): Promise<ApiResult<VideoStatusPayload>> {
  return getApi<VideoStatusPayload>(`/videos/${encodeVideoId(id)}/status`, {
    cache: "no-store",
  });
}

/**
 * Post a new comment or chat message.
 */
export async function addVideoComment(videoId: number, text: string) {
  const headers = authHeaders();
  if (!headers) throw new Error("Authentication required");

  return postApi<any, any>(`/videos/${videoId}/comments`, { text }, { headers });
}

// ─── LIVE STREAMING ─────────────────────────────────────────────────────────

export async function startLiveStream(dto: { title: string; category: string }) {
  const headers = authHeaders();
  return postApi<{ videoId: number; streamKey: string; streamUrl: string }>(
    "/videos/live/start",
    dto,
    { headers: headers ?? undefined }
  );
}

export async function endLiveStream(videoId: number | string) {
  const headers = authHeaders();
  return postApi<{ success: boolean }>(
    `/videos/live/end/${encodeVideoId(videoId)}`,
    {},
    { headers: headers ?? undefined }
  );
}

export async function getJoinToken(videoId: number | string) {
  const headers = authHeaders();
  // Optional auth: viewers can be guests
  return getApi<{ token: string; roomName: string; liveKitUrl: string }>(
    `/videos/live/join/${encodeVideoId(videoId)}`, 
    { headers: headers ?? undefined, cache: "no-store" }
  );
}

export async function getLiveVideos() {
  return getApi<any[]>("/videos/live/list", { cache: "no-store" });
}

export async function recordView(id: number | string): Promise<void> {
  try {
    await postApi<Record<string, never>, unknown>(
      `/videos/${encodeVideoId(id)}/view`,
      {},
    );
  } catch {
    // fire-and-forget
  }
}

export async function likeVideo(id: number | string): Promise<ApiResult<{ liked: boolean, count: number }>> {
  const headers = authHeaders();
  if (!headers) return { ok: false, error: { code: "unauthorized", message: "Log in required" } };
  
  return postApi<any, any>(`/videos/${encodeVideoId(id)}/like`, {}, { headers });
}

export async function unlikeVideo(id: number | string): Promise<ApiResult<{ liked: boolean, count: number }>> {
  const headers = authHeaders();
  if (!headers) return { ok: false, error: { code: "unauthorized", message: "Log in required" } };
  
  return postApi<any, any>(`/videos/${encodeVideoId(id)}/unlike`, {}, { headers });
}
