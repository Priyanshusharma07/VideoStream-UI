import type { ApiResult } from "@/types/api";
import type { Creator, FeedPayload, Video, VideoKind } from "@/types/content";
import { getApi } from "@/services/api-client";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t ? t : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const out: string[] = [];
  for (const v of value) {
    const s = asString(v);
    if (s) out.push(s);
  }
  return out;
}

function formatCompactNumber(n: number): string {
  const abs = Math.abs(n);
  if (abs < 1000) return String(n);
  const units: Array<[number, string]> = [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (const [div, suf] of units) {
    if (abs >= div) {
      const v = n / div;
      const digits = abs >= div * 100 ? 0 : 1;
      const text = v.toFixed(digits).replace(/\.0$/, "");
      return `${text}${suf}`;
    }
  }
  return String(n);
}

function formatViewsLabel(views: number | null): string {
  if (views === null) return "";
  if (views === 1) return "1 view";
  return `${formatCompactNumber(views)} views`;
}

function formatDurationLabel(seconds: number | null): string | undefined {
  if (seconds === null) return undefined;
  if (!Number.isFinite(seconds)) return undefined;
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

function formatUploadedLabel(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const t = d.getTime();
  if (!Number.isFinite(t)) return "";

  const diffMs = Date.now() - t;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 10) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}

function coerceCreator(raw: unknown): Creator {
  if (isRecord(raw)) {
    const id = asString(raw.id) ?? (asNumber(raw.id) !== null ? String(raw.id) : "unknown");
    const name = asString(raw.name) ?? "Unknown";
    const avatarUrl = asString(raw.avatarUrl) ?? "";
    const isLive = raw.isLive === true;
    return { id, name, avatarUrl, isLive };
  }

  const name = asString(raw) ?? "Unknown";
  return { id: "unknown", name, avatarUrl: "" };
}

function coerceVideo(raw: unknown): Video | null {
  if (!isRecord(raw)) return null;

  const idRaw = raw.id;
  const id = asString(idRaw) ?? (asNumber(idRaw) !== null ? String(idRaw) : null);
  const title = asString(raw.title);
  if (!id || !title) return null;

  const tags = asStringArray(raw.tags) ?? [];
  const category = asString(raw.category) ?? tags[0] ?? "General";

  const kindRaw = asString(raw.kind);
  const kind: VideoKind = kindRaw === "live" ? "live" : "video";

  const thumbnailUrl =
    asString(raw.thumbnailUrl) ??
    // backend returns thumbnailPath (S3 key); we can't display it directly without a signed URL
    "";

  const durationLabel =
    asString(raw.durationLabel) ??
    formatDurationLabel(asNumber(raw.duration) ?? null);

  const viewsLabel =
    asString(raw.viewsLabel) ?? formatViewsLabel(asNumber(raw.views) ?? null);

  const uploadedLabel =
    asString(raw.uploadedLabel) ??
    formatUploadedLabel(asString(raw.createdAt));

  const creator = coerceCreator(raw.creator);

  return {
    id,
    title,
    thumbnailUrl,
    durationLabel: durationLabel ?? undefined,
    kind,
    category,
    creator,
    viewsLabel,
    uploadedLabel,
  };
}

function uniqById(creators: Creator[]): Creator[] {
  const seen = new Set<string>();
  const out: Creator[] = [];
  for (const c of creators) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}

function buildFilters(videos: Video[]): string[] {
  const categories = new Set<string>();
  for (const v of videos) categories.add(v.category);
  const list = Array.from(categories).filter(Boolean).slice(0, 10);
  return ["All", ...list];
}

export function coerceFeedPayload(raw: unknown): FeedPayload {
  const record = isRecord(raw) ? raw : {};

  const trendingRaw = Array.isArray(record.trending) ? record.trending : [];
  const forYouRaw = Array.isArray(record.forYou) ? record.forYou : [];

  const trending = trendingRaw.map(coerceVideo).filter(Boolean) as Video[];
  const forYou = forYouRaw.map(coerceVideo).filter(Boolean) as Video[];

  const subscriptionsRaw = Array.isArray(record.subscriptions)
    ? record.subscriptions
    : null;

  const subscriptions = subscriptionsRaw
    ? uniqById(subscriptionsRaw.map(coerceCreator))
    : uniqById([...trending.map((v) => v.creator), ...forYou.map((v) => v.creator)]);

  const filtersRaw = asStringArray(record.forYouFilters);
  const forYouFilters = filtersRaw && filtersRaw.length > 0 ? filtersRaw : buildFilters(forYou);

  const trendingTitle = asString(record.trendingTitle) ?? "Trending Now";

  return {
    trendingTitle,
    trending,
    forYou,
    forYouFilters,
    subscriptions,
  };
}

export async function getFeed(): Promise<ApiResult<FeedPayload>> {
  const result = await getApi<unknown>("/feed", { cache: "no-store" });
  if (!result.ok) return result;
  return { ok: true, data: coerceFeedPayload(result.data) };
}

