import { NextResponse, type NextRequest } from "next/server";
import type { ApiResult } from "@/lib/contracts/api";
import type { VideoDetailsPayload } from "@/lib/contracts/content";
import { getDemoVideoDetails } from "@/lib/demo/content";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const payload: ApiResult<VideoDetailsPayload> = {
    ok: true,
    data: getDemoVideoDetails(id),
  };
  return NextResponse.json(payload);
}
