import type { ApiResult } from "@/types/api";
import { postApi } from "@/services/api-client";
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
  videoId: number;
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
  if (!raw) return "https://api.yourdomain.com";
  return raw.replace(/\/+$/, "");
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
  if (!base) throw new Error("Missing API base.");

  const formData = new FormData();
  formData.append("file", input.file);
  formData.append("title", input.title);
  if (input.description) formData.append("description", input.description);
  if (input.tags && input.tags.length > 0) {
    for (const tag of input.tags) formData.append("tags", tag);
  }
  if (typeof input.isPublic === "boolean") {
    formData.append("isPublic", String(input.isPublic));
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
    const status = getString(payload, ["status"]);
    if (!videoId || (status !== "processing" && status !== "ready")) {
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
      data: { videoId, status: status as UploadVideoMultipartResponse["status"] },
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 401) {
        return { ok: false, error: { code: "unauthorized", message: "Unauthorized" } };
      }
      const message =
        typeof err.response?.data?.message === "string"
          ? err.response.data.message
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
  videoId: number,
): Promise<ApiResult<unknown>> {
  const headers = authHeaders();
  if (!headers) {
    return {
      ok: false,
      error: { code: "unauthorized", message: "Please sign in first." },
    };
  }

  return postApi<Record<string, never>, unknown>(
    `/videos/${videoId}/complete`,
    {},
    { headers },
  );
}
