import { NextResponse } from "next/server";
import type {
  ApiResult,
  ForgotPasswordResponse,
} from "@/lib/contracts/auth";

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as unknown;
  const record = getRecord(body);
  const email = record?.email;

  if (!isNonEmptyString(email) || !isEmail(email)) {
    const payload: ApiResult<ForgotPasswordResponse> = {
      ok: false,
      error: {
        code: "validation_error",
        message: "Email is required and must be valid.",
        fieldErrors: { email: "Enter a valid email." },
      },
    };
    return NextResponse.json(payload, { status: 400 });
  }

  const payload: ApiResult<ForgotPasswordResponse> = {
    ok: true,
    data: { status: "ok" },
  };
  return NextResponse.json(payload, { status: 200 });
}
