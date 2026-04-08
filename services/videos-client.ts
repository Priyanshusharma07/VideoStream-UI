import type { ApiResult } from "@/types/api";
import { getApi, postApi } from "@/services/api-client";
import { getAccessToken } from "@/lib/auth-session";
import axios from "axios";

export type InitiateVideoUploadRequest = {
  title: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
  videoExt: string;
  thumbnailExt: string;
};

export type InitiateVideoUploadResponse = {
  videoId: number;
  videoUploadUrl: string;
  thumbnailUploadUrl: string;
};

export type UploadVideoMultipartRequest = {
  file: File;
  title: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
};

export type UploadVideoMultipartResponse = {
  videoId: string | number;
  status: "processing" | "ready";
};

type InitiateUploadResponseRaw = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function getString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function getNumber(obj: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function normalizeInitiateUploadResponse(
  raw: unknown,
): InitiateVideoUploadResponse | null {
  if (!isRecord(raw)) return null;

  // Common shapes supported:
  // - { videoId, videoUploadUrl, thumbnailUploadUrl }
  // - { videoId, uploadUrls: { video, thumbnail } }
  // - { data: { ... } } (if backend doesn't wrap; postApi already unwraps but keep safe)
  const top = raw as InitiateUploadResponseRaw;
  const candidate = isRecord(top.data) ? (top.data as InitiateUploadResponseRaw) : top;

  const videoId = getNumber(candidate, ["videoId", "id"]);
  const videoUploadUrl =
    getString(candidate, ["videoUploadUrl", "videoPresignedUrl", "videoUrl"]) ??
    (isRecord(candidate.uploadUrls)
      ? getString(candidate.uploadUrls as InitiateUploadResponseRaw, ["video", "videoUploadUrl", "url"])
      : null);
  const thumbnailUploadUrl =
    getString(candidate, ["thumbnailUploadUrl", "thumbnailPresignedUrl", "thumbnailUrl"]) ??
    (isRecord(candidate.uploadUrls)
      ? getString(candidate.uploadUrls as InitiateUploadResponseRaw, ["thumbnail", "thumb", "thumbnailUploadUrl", "url"])
      : null);

  if (!videoId || !videoUploadUrl || !thumbnailUploadUrl) return null;
  return { videoId, videoUploadUrl, thumbnailUploadUrl };
}

function authHeaders(): HeadersInit | null {
  const token = getAccessToken();
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

function apiBase() {
  const raw = process.env.NEXT_PUBLIC_API_BASE?.trim();
  return raw ? raw.replace(/\/+$/, "") : "";
}

function inferVideoExt(file: File): "mp4" | "webm" | "mov" | null {
  const ext = file.name.split(".").pop()?.trim().toLowerCase() ?? "";
  if (ext === "mp4" || ext === "webm" || ext === "mov") return ext;

  const type = file.type.trim().toLowerCase();
  if (type === "video/mp4") return "mp4";
  if (type === "video/webm") return "webm";
  if (type === "video/quicktime") return "mov";

  return null;
}

function throwIfAborted(signal?: AbortSignal) {
  if (!signal) return;
  if (!signal.aborted) return;
  throw new DOMException("Upload aborted", "AbortError");
}

async function sleep(ms: number, signal?: AbortSignal) {
  throwIfAborted(signal);
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (!signal) return;
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Upload aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export async function uploadVideoMultipart(
  input: UploadVideoMultipartRequest,
): Promise<ApiResult<UploadVideoMultipartResponse>> {
  const token = getAccessToken();
  if (!token) {
    return {
      ok: false,
      error: { code: "unauthorized", message: "Please sign in first." },
    };
  }

  const base = apiBase();
  // Demo mode: if no API base is configured, simulate an upload so the UI can be developed end-to-end.
  if (!base) {
    const videoExt = inferVideoExt(input.file);
    if (!videoExt) {
      return {
        ok: false,
        error: {
          code: "validation_error",
          message: "Unsupported video format. Please upload mp4, webm, or mov.",
        },
      };
    }

    input.onProgress?.(0);
    const steps = [6, 18, 35, 58, 76, 92, 100];
    for (const pct of steps) {
      await sleep(140, input.signal);
      input.onProgress?.(pct);
    }

    return {
      ok: true,
      data: { videoId: `v-upload-${crypto.randomUUID()}`, status: "processing" },
    };
  }

  const formData = new FormData();
  formData.append("file", input.file);
  formData.append("title", input.title);
  if (input.description) formData.append("description", input.description);
  // IMPORTANT: many NestJS multipart setups give you a string when only one `tags` field is sent,
  // which fails `@IsArray()`. To keep the payload an array, we duplicate the single tag.
  if (input.tags && input.tags.length > 0) {
    if (input.tags.length === 1) {
      formData.append("tags", input.tags[0]);
      formData.append("tags", input.tags[0]);
    } else {
      for (const tag of input.tags) formData.append("tags", tag);
    }
  }

  // Some backends validate `videoExt` (e.g. mp4/webm/mov) even on multipart uploads.
  const videoExt = inferVideoExt(input.file);
  if (!videoExt) {
    return {
      ok: false,
      error: {
        code: "validation_error",
        message: "Unsupported video format. Please upload mp4, webm, or mov.",
      },
    };
  }
  formData.append("videoExt", videoExt);

  // NOTE: We intentionally do NOT send `isPublic` here.
  // In many NestJS + multipart setups, `isPublic` arrives as a string and fails `@IsBoolean()`
  // unless the backend enables implicit conversion or uses `@IsBooleanString()`.

  if (process.env.NEXT_PUBLIC_API_DEBUG === "1") {
    console.log("Uploading multipart fields:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File(${value.name})` : value);
    }
  }

  try {
    const res = await axios.post(`${base}/videos/upload`, formData, {
      signal: input.signal,
      headers: { Authorization: `Bearer ${token}` },
      onUploadProgress: (e) => {
        if (!input.onProgress) return;
        const total = typeof e.total === "number" && e.total > 0 ? e.total : null;
        if (!total) return;
        const pct = Math.min(100, Math.round((e.loaded * 100) / total));
        input.onProgress(pct);
      },
    });

    const raw = res.data as unknown;
    if (!isRecord(raw)) {
      return {
        ok: false,
        error: { code: "bad_response", message: "Unexpected response." },
      };
    }

    const payload =
      typeof raw.ok === "boolean" && raw.ok && isRecord(raw.data)
        ? (raw.data as Record<string, unknown>)
        : raw;

    const videoId = getNumber(payload, ["videoId", "id"]);
    const videoIdStr = getString(payload, ["videoId", "id"]);
    const status = getString(payload, ["status"]);
    const resolvedVideoId: string | number | null = videoId ?? videoIdStr;
    if (!resolvedVideoId || (status !== "processing" && status !== "ready")) {
      return {
        ok: false,
        error: {
          code: "bad_response",
          message: "Unexpected response. Expected videoId and status.",
        },
      };
    }

    return {
      ok: true,
      data: {
        videoId: resolvedVideoId,
        status: status as UploadVideoMultipartResponse["status"],
      },
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 401) {
        return { ok: false, error: { code: "unauthorized", message: "Unauthorized" } };
      }
      const data = err.response?.data as unknown;
      const rawMessage = isRecord(data) ? data.message : null;
      const message =
        typeof rawMessage === "string"
          ? rawMessage
          : Array.isArray(rawMessage) && rawMessage.every((m) => typeof m === "string")
            ? rawMessage.join(" ")
            : err.message;
      return { ok: false, error: { code: "request_failed", message } };
    }
    const message = err instanceof Error ? err.message : "Upload failed";
    return { ok: false, error: { code: "request_failed", message } };
  }
}

export async function initiateVideoUpload(
  input: InitiateVideoUploadRequest,
): Promise<ApiResult<InitiateVideoUploadResponse>> {
  const headers = authHeaders();
  if (!headers) {
    return {
      ok: false,
      error: { code: "unauthorized", message: "Please sign in first." },
    };
  }

  const result = await postApi<InitiateVideoUploadRequest, unknown>(
    "/videos/initiate",
    input,
    { headers },
  );

  if (!result.ok) return result as ApiResult<InitiateVideoUploadResponse>;

  const normalized = normalizeInitiateUploadResponse(result.data);
  if (!normalized) {
    return {
      ok: false,
      error: {
        code: "bad_response",
        message:
          "Unexpected initiate response. Expected videoId, videoUploadUrl, thumbnailUploadUrl.",
      },
    };
  }

  return { ok: true, data: normalized };
}

export async function completeVideoUpload(
  videoId: string | number,
): Promise<ApiResult<unknown>> {
  const headers = authHeaders();
  if (!headers) {
    return {
      ok: false,
      error: { code: "unauthorized", message: "Please sign in first." },
    };
  }

  return postApi<Record<string, never>, unknown>(
    `/videos/${encodeURIComponent(String(videoId))}/complete`,
    {},
    { headers },
  );
}

// ── Watch page ────────────────────────────────────────────────────────────────

export type VideoCreator = {
  id: number | string;
  name: string;
  avatarUrl: string | null;
};

export type VideoDetail = {
  id: number | string;
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl: string | null;
  durationLabel?: string;
  kind: "video" | "live";
  category: string;
  creator: VideoCreator;
  viewsLabel: string;
  uploadedLabel: string;
  likesLabel: string;
  status: string;
};

export type ChatMessage = {
  id: string;
  user: { name: string; badge?: "mod" | "creator" };
  message: string;
  highlighted?: boolean;
};

export type WatchPagePayload = {
  video: VideoDetail;
  chat: { viewersLabel: string; messages: ChatMessage[] };
  playback: {
    hlsManifestPath?: string | null;
    signedUrl?: string | null;
    status: string;
    expiresIn?: number;
  };
};

export type VideoStatusPayload = {
  id: number | string;
  status: string;
  hlsReady: boolean;
  hlsManifestPath: string | null;
};

function encodeVideoId(id: number | string) {
  return encodeURIComponent(String(id));
}

const API_PREFIX_RAW = process.env.NEXT_PUBLIC_API_PREFIX ?? "/api";
const API_PREFIX = API_PREFIX_RAW.startsWith("/") ? API_PREFIX_RAW : `/${API_PREFIX_RAW}`;

function buildUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;

  const base = apiBase();
  if (base) return `${base}${normalized}`;

  if (normalized === API_PREFIX || normalized.startsWith(`${API_PREFIX}/`)) {
    return normalized;
  }
  return `${API_PREFIX}${normalized}`;
}

export async function getVideoDetails(
  id: number | string,
): Promise<ApiResult<WatchPagePayload>> {
  return getApi<WatchPagePayload>(`/videos/${encodeVideoId(id)}`, { cache: "no-store" });
}

export async function pollVideoStatus(
  id: number | string,
): Promise<ApiResult<VideoStatusPayload>> {
  return getApi<VideoStatusPayload>(`/videos/${encodeVideoId(id)}/status`, {
    cache: "no-store",
  });
}

export async function recordView(id: number | string): Promise<void> {
  try {
    await postApi<Record<string, never>, unknown>(
      `/videos/${encodeVideoId(id)}/view`,
      {},
    );
    return;
  } catch {
    // fall back to older implementation
  }
  const url = buildUrl(`/videos/${id}/view`);
  try {
    await fetch(url, { method: "POST", cache: "no-store" });
  } catch {
    // fire-and-forget — silently ignore failures
  }
}
