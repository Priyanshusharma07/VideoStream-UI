import { NextResponse } from "next/server";
import type { ApiResult } from "@/types/api";

export async function POST() {
  const payload: ApiResult<{ status: "ok" }> = { ok: true, data: { status: "ok" } };
  return NextResponse.json(payload);
}

