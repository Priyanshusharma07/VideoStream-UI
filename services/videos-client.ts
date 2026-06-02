import type { ApiResult } from "@/types/api";
import { getApi, postApi } from "@/services/api-client";
import { getAccessToken } from "@/lib/auth-session";
import type { VideoStatusPayload, WatchPagePayload } from "@/types/watch";

async function authHeaders(overrideToken?: string | null): Promise<HeadersInit | null> {
  const token = overrideToken ?? await getAccessToken();
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
export async function addVideoComment(videoId: number, text: string, token?: string) {
  const headers = await authHeaders(token);
  if (!headers) throw new Error("Authentication required");

  return postApi<{ text: string }, any>(`/videos/${videoId}/comments`, { text }, { headers });
}

// ─── LIVE STREAMING ─────────────────────────────────────────────────────────

export async function startLiveStream(dto: { title: string; category: string }, token?: string) {
  const headers = await authHeaders(token);
  return postApi<{ title: string; category: string }, { videoId: number; streamKey: string; streamUrl: string }>(
    "/videos/live/start",
    dto,
    { headers: headers ?? undefined }
  );
}

export async function endLiveStream(videoId: number | string, token?: string) {
  const headers = await authHeaders(token);
  return postApi<Record<string, never>, { success: boolean }>(
    `/videos/live/end/${encodeVideoId(videoId)}`,
    {},
    { headers: headers ?? undefined }
  );
}

export async function getJoinToken(videoId: number | string, token?: string) {
  const headers = await authHeaders(token);
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

export async function likeVideo(id: number | string, token?: string): Promise<ApiResult<{ liked: boolean, count: number }>> {
  const headers = await authHeaders(token);
  if (!headers) return { ok: false, error: { code: "unauthorized", message: "Log in required" } };
  
  return postApi<Record<string, never>, { liked: boolean, count: number }>(`/videos/${encodeVideoId(id)}/like`, {}, { headers });
}

export async function unlikeVideo(id: number | string, token?: string): Promise<ApiResult<{ liked: boolean, count: number }>> {
  const headers = await authHeaders(token);
  if (!headers) return { ok: false, error: { code: "unauthorized", message: "Log in required" } };
  
  return postApi<Record<string, never>, { liked: boolean, count: number }>(`/videos/${encodeVideoId(id)}/unlike`, {}, { headers });
}
