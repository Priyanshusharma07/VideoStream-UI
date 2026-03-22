import { NextResponse } from "next/server";
import type { ApiResult } from "@/types/api";
import type { FeedPayload } from "@/types/content";
import { getDemoFeed } from "@/lib/demo/content";

export function GET() {
  const payload: ApiResult<FeedPayload> = { ok: true, data: getDemoFeed() };
  return NextResponse.json(payload);
}
