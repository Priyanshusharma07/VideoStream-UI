import { NextResponse } from "next/server";

type ApiError = { code: string; message: string };
type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

type SearchItem = {
  id: string;
  title: string;
  year?: number;
  kind: "movie" | "show" | "live";
};

const DATASET: SearchItem[] = [
  { id: "m1", title: "Cyber City", year: 2024, kind: "movie" },
  { id: "m2", title: "Neon Runner", year: 2023, kind: "movie" },
  { id: "s1", title: "Anime Nights", year: 2022, kind: "show" },
  { id: "s2", title: "Action Protocol", year: 2021, kind: "show" },
  { id: "l1", title: "Live Arena", kind: "live" },
  { id: "m3", title: "Sci‑Fi Frontier", year: 2020, kind: "movie" },
];

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  if (q.length < 2) {
    const payload: ApiResult<{ items: SearchItem[] }> = {
      ok: false,
      error: { code: "validation_error", message: "Query must be at least 2 characters." },
    };
    return NextResponse.json(payload, { status: 400 });
  }

  const items = DATASET.filter((item) => item.title.toLowerCase().includes(q)).slice(
    0,
    12,
  );

  const payload: ApiResult<{ items: SearchItem[] }> = { ok: true, data: { items } };
  return NextResponse.json(payload);
}

