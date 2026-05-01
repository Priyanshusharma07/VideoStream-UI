import type { ApiResult } from "@/types/api";
import { getApi, postApi } from "@/services/api-client";
import { getAccessToken } from "@/lib/auth-session";
import type { VideoStatusPayload, WatchPagePayload } from "@/types/watch";
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

function encodeVideoId(id: number | string) {
  return encodeURIComponent(String(id));
}

export async function getVideoDetails(
  id: number | string,
): Promise<ApiResult<WatchPagePayload>> {
  const result = await getApi<unknown>(`/videos/${encodeVideoId(id)}`, {
    cache: "no-store",
  });
  if (!result.ok) return result as ApiResult<WatchPagePayload>;

  const payload = coerceWatchPagePayload(result.data, id);
  if (!payload) {
    return {
      ok: false,
      error: { code: "bad_response", message: "Unexpected video details response." },
    };
  }

  return { ok: true, data: payload };
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
  } catch {
    // fire-and-forget — silently ignore failures
  }
}

function formatCompactNumber(n: number): string {
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

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => typeof v === "string") as string[];
}

function coerceWatchPagePayload(
  raw: unknown,
  fallbackId: number | string,
): WatchPagePayload | null {
  if (!isRecord(raw)) return null;

  // If the backend already returns the desired WatchPagePayload shape, accept it.
  if (isRecord(raw.video) && isRecord(raw.chat) && isRecord(raw.playback)) {
    const video = raw.video as Record<string, unknown>;
    const chat = raw.chat as Record<string, unknown>;
    const playback = raw.playback as Record<string, unknown>;
    if (
      typeof video.title === "string" &&
      isRecord(video.creator) &&
      typeof chat.viewersLabel === "string" &&
      typeof playback.status === "string"
    ) {
      return raw as WatchPagePayload;
    }
  }

  const videoRaw = isRecord(raw.video) ? (raw.video as Record<string, unknown>) : null;
  if (!videoRaw) return null;

  const id =
    getNumber(videoRaw, ["id"]) ?? getString(videoRaw, ["id"]) ?? String(fallbackId);
  const title = getString(videoRaw, ["title"]) ?? "Untitled";
  const description = getString(videoRaw, ["description"]) ?? "";
  const tags = asStringArray(videoRaw.tags);
  const thumbnailUrl = getString(videoRaw, ["thumbnailUrl"]) ?? null;
  const status = getString(videoRaw, ["status"]) ?? "processing";

  const likes =
    typeof raw.likes === "number" && Number.isFinite(raw.likes) ? raw.likes : 0;

  const playbackRaw = isRecord(raw.playback) ? (raw.playback as Record<string, unknown>) : {};
  const playbackStatus = getString(playbackRaw, ["status"]) ?? status;
  const hlsManifestPath = getString(playbackRaw, ["hlsManifestPath"]) ?? null;

  const chatRaw = isRecord(raw.chat) ? (raw.chat as Record<string, unknown>) : {};
  const messagesRaw = Array.isArray(chatRaw.messages) ? chatRaw.messages : [];
  const messages = messagesRaw
    .filter((m): m is Record<string, unknown> => isRecord(m))
    .map((m) => {
      const mid =
        getString(m, ["id"]) ??
        `m-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;
      const userRaw = isRecord(m.user) ? (m.user as Record<string, unknown>) : {};
      const name = getString(userRaw, ["name"]) ?? "Anonymous";
      const message = getString(m, ["message"]) ?? "";
      return { id: mid, user: { name }, message };
    });

  return {
    video: {
      id,
      title,
      description,
      tags,
      thumbnailUrl,
      kind: "video",
      category: tags[0] ?? "General",
      creator: { id: "unknown", name: "Unknown", avatarUrl: null },
      viewsLabel: "",
      uploadedLabel: "",
      likesLabel: formatCompactNumber(likes),
      status,
    },
    chat: { viewersLabel: "0 viewers", messages },
    playback: { status: playbackStatus, hlsManifestPath },
  };
}

// NOTE: The presigned URL upload flow (getUploadUrl, uploadVideo, confirmUpload)
// lives in @/services/video.service.ts — use that for all upload operations.
