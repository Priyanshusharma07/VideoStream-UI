import type { ApiError, ApiResult } from "@/types/api";

const API_BASE_RAW = process.env.NEXT_PUBLIC_API_BASE;
const API_BASE = API_BASE_RAW ? API_BASE_RAW.replace(/\/+$/, "") : "";

const API_PREFIX_RAW = process.env.NEXT_PUBLIC_API_PREFIX ?? "/api";
const API_PREFIX = API_PREFIX_RAW.startsWith("/")
  ? API_PREFIX_RAW
  : `/${API_PREFIX_RAW}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isApiResult(value: unknown): value is ApiResult<unknown> {
  if (!isRecord(value)) return false;
  if (typeof value.ok !== "boolean") return false;
  if (value.ok) return "data" in value;
  return "error" in value;
}

function coerceApiError(value: unknown, fallback: ApiError): ApiError {
  if (!isRecord(value)) return fallback;

  const code = typeof value.code === "string" ? value.code : fallback.code;
  const message =
    typeof value.message === "string"
      ? value.message
      : Array.isArray(value.message) &&
          value.message.every((v) => typeof v === "string")
        ? value.message.join(" ")
        : fallback.message;
  const fieldErrors =
    isRecord(value.fieldErrors) &&
    Object.values(value.fieldErrors).every((v) => typeof v === "string")
      ? (value.fieldErrors as Record<string, string>)
      : undefined;

  return { code, message, fieldErrors };
}

function buildApiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;

  // If an explicit API base is configured, always use it (useful for separate backend + CORS).
  if (API_BASE) return `${API_BASE}${normalized}`;

  // Otherwise default to same-origin Next.js Route Handlers under /api.
  if (normalized === API_PREFIX || normalized.startsWith(`${API_PREFIX}/`)) {
    return normalized;
  }
  return `${API_PREFIX}${normalized}`;
}

function shouldLog() {
  return process.env.NEXT_PUBLIC_API_DEBUG === "1";
}

export async function postApi<Req, Res>(
  path: string,
  input: Req,
  init?: Omit<RequestInit, "method" | "body">,
): Promise<ApiResult<Res>> {
  const url = buildApiUrl(path);

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      method: "POST",
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      body: JSON.stringify(input),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: { code: "network_error", message } };
  }

  if (shouldLog()) console.log(`POST ${url} - Status: ${res.status}`);

  const rawText = await res.text().catch(() => "");
  let json: unknown = null;
  let jsonParseFailed = false;
  if (rawText) {
    try {
      json = JSON.parse(rawText) as unknown;
    } catch {
      json = null;
      jsonParseFailed = true;
    }
  }

  if (res.ok && jsonParseFailed) {
    return {
      ok: false,
      error: { code: "bad_response", message: "Invalid JSON response" },
    };
  }

  if (!res.ok) {
    if (res.status === 401) {
      return {
        ok: false,
        error: { code: "unauthorized", message: "Unauthorized" },
      };
    }
    if (res.status === 403) {
      return {
        ok: false,
        error: { code: "forbidden", message: "Forbidden" },
      };
    }
    const fallbackError: ApiError = {
      code: "request_failed",
      message: res.statusText || "Request failed",
    };

    const record = isRecord(json) ? json : null;
    const errorFromJson = record?.error ?? record ?? null;
    const messageFromJson =
      typeof record?.message === "string" ? record.message : null;

    return {
      ok: false,
      error: coerceApiError(
        errorFromJson,
        messageFromJson
          ? { ...fallbackError, message: messageFromJson }
          : fallbackError,
      ),
    };
  }

  if (isApiResult(json)) return json as ApiResult<Res>;

  // Some endpoints return raw payloads without the ApiResult<T> wrapper.
  const record = isRecord(json) ? json : null;
  if (record && "data" in record && Object.keys(record).length === 1) {
    return { ok: true, data: record.data as Res };
  }
  return { ok: true, data: json as Res };
}

export async function getApi<Res>(
  path: string,
  init?: Omit<RequestInit, "method">,
): Promise<ApiResult<Res>> {
  const url = buildApiUrl(path);

  let res: Response;
  try {
    res = await fetch(url, { ...init, method: "GET" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: { code: "network_error", message } };
  }

  if (shouldLog()) console.log(`GET ${url} - Status: ${res.status}`);

  if (!res.ok) {
    if (res.status === 401) {
      return {
        ok: false,
        error: { code: "unauthorized", message: "Unauthorized" },
      };
    }
    if (res.status === 403) {
      return {
        ok: false,
        error: { code: "forbidden", message: "Forbidden" },
      };
    }
    if (res.status === 404) {
      return {
        ok: false,
        error: { code: "not_found", message: "Not found" },
      };
    }

    return {
      ok: false,
      error: {
        code: "request_failed",
        message: res.statusText || "Request failed",
      },
    };
  }

  const rawText = await res.text().catch(() => "");
  if (!rawText) return { ok: true, data: null as Res };

  try {
    const json = JSON.parse(rawText) as unknown;
    if (isApiResult(json)) return json as ApiResult<Res>;
    return { ok: true, data: json as Res };
  } catch {
    return {
      ok: false,
      error: { code: "bad_response", message: "Invalid JSON response" },
    };
  }
}

export async function patchApi<Req, Res>(
  path: string,
  input: Req,
  init?: Omit<RequestInit, "method" | "body">,
): Promise<ApiResult<Res>> {
  const url = buildApiUrl(path);

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      body: JSON.stringify(input),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: { code: "network_error", message } };
  }

  if (shouldLog()) console.log(`PATCH ${url} - Status: ${res.status}`);

  const rawText = await res.text().catch(() => "");
  let json: unknown = null;
  let jsonParseFailed = false;
  if (rawText) {
    try {
      json = JSON.parse(rawText) as unknown;
    } catch {
      json = null;
      jsonParseFailed = true;
    }
  }

  if (res.ok && jsonParseFailed) {
    return {
      ok: false,
      error: { code: "bad_response", message: "Invalid JSON response" },
    };
  }

  if (!res.ok) {
    const fallbackError: ApiError = {
      code: "request_failed",
      message: res.statusText || "Request failed",
    };

    const record = isRecord(json) ? json : null;
    const errorFromJson = record?.error ?? record ?? null;
    const messageFromJson =
      typeof record?.message === "string" ? record.message : null;

    return {
      ok: false,
      error: coerceApiError(
        errorFromJson,
        messageFromJson
          ? { ...fallbackError, message: messageFromJson }
          : fallbackError,
      ),
    };
  }

  if (isApiResult(json)) return json as ApiResult<Res>;
  return { ok: true, data: json as Res };
}
