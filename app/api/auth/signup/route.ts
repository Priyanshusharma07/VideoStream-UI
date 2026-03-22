import { NextResponse } from "next/server";
import type { ApiResult, SignupResponse } from "@/types/auth";

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function json<T>(payload: T, status = 200) {
  return NextResponse.json(payload, { status });
}

const DEMO_EMAIL = "demo@streamhub.com";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as unknown;
  const record = getRecord(body);
  const fieldErrors: Record<string, string> = {};

  const rawName = record?.name;
  const rawEmail = record?.email;
  const rawPassword = record?.password;

  const name = isNonEmptyString(rawName) ? rawName.trim() : "";
  const email = isNonEmptyString(rawEmail) ? rawEmail.trim() : "";
  const password = isNonEmptyString(rawPassword) ? rawPassword : "";

  if (name.length < 2) {
    fieldErrors.name = "Name is required (min 2 characters).";
  }
  if (!email || !isEmail(email)) {
    fieldErrors.email = "Email is required and must be valid.";
  }
  if (password.length < 6) {
    fieldErrors.password = "Password is required (min 6 characters).";
  }

  if (Object.keys(fieldErrors).length > 0) {
    const payload: ApiResult<SignupResponse> = {
      ok: false,
      error: {
        code: "validation_error",
        message: "Invalid request body.",
        fieldErrors,
      },
    };
    return json(payload, 400);
  }

  if (email === DEMO_EMAIL) {
    const payload: ApiResult<SignupResponse> = {
      ok: false,
      error: {
        code: "email_taken",
        message: "An account with this email already exists.",
        fieldErrors: { email: "Email already in use." },
      },
    };
    return json(payload, 409);
  }

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const response: SignupResponse = {
    accessToken: `demo-access-${crypto.randomUUID()}`,
    refreshToken: `demo-refresh-${crypto.randomUUID()}`,
    expiresAt,
    user: {
      id: crypto.randomUUID(),
      email,
      name,
    },
  };

  const payload: ApiResult<SignupResponse> = { ok: true, data: response };
  return json(payload, 200);
}
