"use client";

const STORAGE_KEY = "streamhub.watchlist.v1";

function safeParseJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function uniq(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    const trimmed = id.trim();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

export function getWatchlistIds(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const json = safeParseJson(raw);
  if (!Array.isArray(json) || !json.every((v) => typeof v === "string")) return [];
  return uniq(json);
}

export function setWatchlistIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniq(ids)));
  // Notify same-tab listeners (storage event does not fire in same tab).
  window.dispatchEvent(new Event("streamhub:watchlist"));
}

export function isInWatchlist(videoId: string): boolean {
  const id = videoId.trim();
  if (!id) return false;
  return getWatchlistIds().includes(id);
}

export function addToWatchlist(videoId: string) {
  const id = videoId.trim();
  if (!id) return;
  const ids = getWatchlistIds();
  setWatchlistIds([id, ...ids]);
}

export function removeFromWatchlist(videoId: string) {
  const id = videoId.trim();
  if (!id) return;
  const ids = getWatchlistIds().filter((x) => x !== id);
  setWatchlistIds(ids);
}

export function toggleWatchlist(videoId: string): boolean {
  const id = videoId.trim();
  if (!id) return false;
  const ids = getWatchlistIds();
  const exists = ids.includes(id);
  if (exists) setWatchlistIds(ids.filter((x) => x !== id));
  else setWatchlistIds([id, ...ids]);
  return !exists;
}

