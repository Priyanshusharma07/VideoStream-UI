import { NextResponse } from "next/server";
import type { ApiResult } from "@/types/api";
import type { DashboardPayload } from "@/types/content";
import { getDemoDashboard } from "@/lib/demo/content";

export function GET() {
  const payload: ApiResult<DashboardPayload> = { ok: true, data: getDemoDashboard() };
  return NextResponse.json(payload);
}
