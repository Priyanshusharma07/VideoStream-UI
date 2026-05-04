import type { ApiResult } from "@/types/api";
import type { FeedPayload } from "@/types/content";
import { getApi } from "@/services/api-client";

/**
 * Get the home feed.
 * The backend now returns a structured FeedPayload with trending, forYou, and subscriptions.
 */
export async function getFeed(): Promise<ApiResult<FeedPayload>> {
  const result = await getApi<FeedPayload>("/feed", { cache: "no-store" });
  return result;
}
