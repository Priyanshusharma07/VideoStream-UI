import { NextResponse, type NextRequest } from "next/server";
import type { ApiResult } from "@/types/api";
import type { VideoStatusPayload } from "@/types/video";

const DEMO_HLS_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const payload: ApiResult<VideoStatusPayload> = {
    ok: true,
    data: {
      id,
      status: "ready",
      hlsReady: true,
      hlsManifestPath: DEMO_HLS_URL,
    },
  };

  return NextResponse.json(payload);
}

