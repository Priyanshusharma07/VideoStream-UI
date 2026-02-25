import { NextResponse } from "next/server";
import type { ApiResult } from "@/lib/contracts/api";
import type { DashboardPayload } from "@/lib/contracts/content";
import { getDemoDashboard } from "@/lib/demo/content";

export function GET() {
  const payload: ApiResult<DashboardPayload> = { ok: true, data: getDemoDashboard() };
  return NextResponse.json(payload);
}

