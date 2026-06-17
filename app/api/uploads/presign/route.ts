import { NextResponse } from "next/server";
import type { ApiResult } from "@/types/api";
import type {
  CreatePresignedUploadResponse,
} from "@/types/upload";

import crypto from "crypto";

export const runtime = "nodejs";

function json<T>(payload: T, status = 200) {
  return NextResponse.json(payload, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function sanitizeFilename(filename: string) {
  const trimmed = filename.trim();
  const safe = trimmed.replace(/[^a-zA-Z0-9._-]+/g, "_");
  const maxLen = 120;
  return safe.length > maxLen ? safe.slice(-maxLen) : safe;
}

function ensurePrefix(prefix: string) {
  const trimmed = prefix.trim();
  if (!trimmed) return "";
  const normalized = trimmed.replace(/^\/+/, "");
  return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

export async function POST(req: Request) {
  const prefix = ensurePrefix(process.env.AWS_S3_PREFIX ?? "uploads");
  const expiresInSeconds = Number(
    process.env.AWS_S3_PRESIGN_EXPIRES_SECONDS ?? "600",
  );

  const body = (await req.json().catch(() => null)) as unknown;
  const record = isRecord(body) ? body : null;

  const filename = isNonEmptyString(record?.filename) ? record.filename.trim() : "";
  const contentType = isNonEmptyString(record?.contentType) ? record.contentType.trim() : "";
  const sizeRaw = record?.size;
  const size =
    typeof sizeRaw === "number" && Number.isFinite(sizeRaw) && sizeRaw >= 0
      ? sizeRaw
      : -1;

  const fieldErrors: Record<string, string> = {};
  if (!filename) fieldErrors.filename = "filename is required.";
  if (!contentType || !contentType.startsWith("video/")) {
    fieldErrors.contentType = "contentType must be a video/* MIME type.";
  }
  if (size < 0) fieldErrors.size = "size must be a non-negative number.";

  if (Object.keys(fieldErrors).length > 0) {
    const payload: ApiResult<CreatePresignedUploadResponse> = {
      ok: false,
      error: {
        code: "validation_error",
        message: "Invalid request body.",
        fieldErrors,
      },
    };
    return json(payload, 400);
  }

  // Avoid user-controlled paths in S3 keys.
  const safeName = sanitizeFilename(filename);
  const key = `${prefix}${crypto.randomUUID()}-${safeName}`;

  // Demo-only response (no real backend / S3 required).
  // When you wire a real backend, replace this with a server-side call that generates a presigned URL.
  const uploadUrl = `https://example.invalid/presigned-upload/${encodeURIComponent(key)}`;

  const expiresAt = new Date(
    Date.now() +
      1000 *
        (Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
          ? expiresInSeconds
          : 600),
  ).toISOString();

  const response: CreatePresignedUploadResponse = {
    uploadUrl,
    key,
    expiresAt,
    bucket: "demo",
    region: "demo",
  };

  const payload: ApiResult<CreatePresignedUploadResponse> = { ok: true, data: response };
  return json(payload, 200);
}
