import { NextResponse } from "next/server";
import type { ApiResult } from "@/types/api";

export async function POST() {
  try {
    const payload: ApiResult<{ status: "ok" }> = { ok: true, data: { status: "ok" } };
    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "internal_error", message: error.message || "Something went wrong" } },
      { status: 500 }
    );
  }
}

