import { NextResponse } from "next/server";
import type { ApiResult } from "@/lib/contracts/api";
import type { CompleteUploadResponse } from "@/lib/contracts/upload";

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

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as unknown;
  const record = isRecord(body) ? body : null;

  const key = isNonEmptyString(record?.key) ? record.key.trim() : "";
  const title = isNonEmptyString(record?.title) ? record.title.trim() : "";

  const fieldErrors: Record<string, string> = {};
  if (!key) fieldErrors.key = "key is required.";
  if (!title) fieldErrors.title = "title is required.";

  if (Object.keys(fieldErrors).length > 0) {
    const payload: ApiResult<CompleteUploadResponse> = {
      ok: false,
      error: {
        code: "validation_error",
        message: "Invalid request body.",
        fieldErrors,
      },
    };
    return json(payload, 400);
  }

  // Demo-only endpoint: in a real backend you'd persist metadata, kick off transcoding, etc.
  // Keep the response stable for the UI.
  const response: CompleteUploadResponse = {
    videoId: `v-upload-${crypto.randomUUID()}`,
    status: "processing",
  };

  const payload: ApiResult<CompleteUploadResponse> = { ok: true, data: response };
  return json(payload, 200);
}
