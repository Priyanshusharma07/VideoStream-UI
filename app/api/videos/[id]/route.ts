import { NextResponse, type NextRequest } from "next/server";
import type { ApiResult } from "@/types/api";
import type { WatchPagePayload } from "@/types/watch";
import { getDemoVideoDetails } from "@/lib/demo/content";

const DEMO_HLS_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

function demoWatchPayload(id: string): WatchPagePayload {
  if (id.startsWith("v-upload-")) {
    return {
      video: {
        id,
        title: "Your uploaded video (demo)",
        description:
          "This is a demo upload. When the real backend is wired in, this page will show your actual video metadata and playback URLs.",
        tags: ["Upload", "Demo"],
        thumbnailUrl: "/demo/thumbs/thumb-04.svg",
        durationLabel: "00:30",
        kind: "video",
        category: "Uploads",
        creator: { id: "me", name: "You", avatarUrl: "/demo/avatars/avatar-01.svg" },
        viewsLabel: "0 views",
        uploadedLabel: "Just now",
        likesLabel: "0",
        status: "ready",
      },
      chat: { viewersLabel: "0 viewers", messages: [] },
      playback: { status: "ready", hlsManifestPath: DEMO_HLS_URL },
    };
  }

  const details = getDemoVideoDetails(id);
  return {
    video: {
      id: details.video.id,
      title: details.video.title,
      description: details.video.description,
      tags: details.video.tags,
      thumbnailUrl: details.video.thumbnailUrl ?? null,
      durationLabel: details.video.durationLabel,
      kind: details.video.kind,
      category: details.video.category,
      creator: {
        id: details.video.creator.id,
        name: details.video.creator.name,
        avatarUrl: details.video.creator.avatarUrl ?? null,
      },
      viewsLabel: details.video.viewsLabel,
      uploadedLabel: details.video.uploadedLabel,
      likesLabel: details.video.likesLabel,
      status: details.video.kind === "live" ? "live" : "ready",
    },
    chat: details.chat,
    playback: { status: "ready", hlsManifestPath: DEMO_HLS_URL },
  };
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const payload: ApiResult<WatchPagePayload> = { ok: true, data: demoWatchPayload(id) };
    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "not_found", message: error.message || "Video not found" } },
      { status: 404 }
    );
  }
}
