import { NextResponse } from "next/server";
import type { ApiResult } from "@/types/api";

export async function POST() {
  const payload: ApiResult<{ likesLabel: string }> = {
    ok: true,
    data: { likesLabel: "45K" },
  };
  return NextResponse.json(payload);
}

