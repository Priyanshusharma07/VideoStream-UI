import { mockVideos } from "@/src/data/mockVideos";
import type { Video } from "@/src/types/video";
import { isLiveVideo } from "@/src/utils/video";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeCategory(value: string): string {
  return value.trim().toLowerCase();
}

export async function getVideos(): Promise<Video[]> {
  await delay(350);
  return [...mockVideos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getVideoById(id: string): Promise<Video | null> {
  await delay(250);
  const normalized = id.trim();
  if (!normalized) return null;
  return mockVideos.find((v) => v.id === normalized) ?? null;
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  await delay(300);
  const needle = normalizeCategory(category);
  if (!needle) return [];
  return mockVideos.filter((v) => normalizeCategory(v.category) === needle);
}

export async function getLiveVideos(): Promise<Video[]> {
  await delay(250);
  return [...mockVideos]
    .filter(isLiveVideo)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function searchVideos(query: string): Promise<Video[]> {
  await delay(250);
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const scored = mockVideos
    .map((v) => {
      const hay = `${v.title} ${v.channelName} ${v.category} ${v.description}`.toLowerCase();
      const idx = hay.indexOf(q);
      const score = idx === -1 ? Infinity : idx;
      return { v, score };
    })
    .filter((x) => x.score !== Infinity)
    .sort((a, b) => a.score - b.score || b.v.views - a.v.views)
    .map((x) => x.v);

  return scored.slice(0, 24);
}

export async function getRecommendedVideos(
  current: Video,
  max = 6,
): Promise<Video[]> {
  await delay(200);
  const sameCategory = mockVideos.filter(
    (v) => v.id !== current.id && normalizeCategory(v.category) === normalizeCategory(current.category),
  );
  const fallback = mockVideos.filter((v) => v.id !== current.id);

  const merged = [...sameCategory, ...fallback].reduce<Video[]>((acc, v) => {
    if (acc.length >= max) return acc;
    if (acc.some((x) => x.id === v.id)) return acc;
    acc.push(v);
    return acc;
  }, []);

  return merged.slice(0, max);
}
