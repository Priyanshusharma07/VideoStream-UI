/**
 * app/api/proxy/[...path]/route.ts
 *
 * A catch-all reverse proxy that forwards every request — including the
 * Authorization header — to the real NestJS backend.
 *
 * Why this exists:
 *   Vercel strips the `Authorization` header when Next.js `rewrites()` proxy
 *   a request to an external origin.  A Route Handler runs server-side and is
 *   NOT subject to that restriction, so it can forward the token verbatim.
 *
 * Route handled: /api/proxy/**  →  https://cineview-api.priyanshusharma015.in/**
 */

import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

const BACKEND_ORIGIN =
  (process.env.BACKEND_ORIGIN ?? "https://cineview-api.priyanshusharma015.in").replace(/\/+$/, "");

/** Headers the proxy should NOT forward upstream (hop-by-hop / sensitive). */
const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  // Next.js / Vercel internal headers
  "x-middleware-rewrite",
  "x-nextjs-page",
]);

function buildUpstreamHeaders(incoming: Headers): Headers {
  const out = new Headers();
  incoming.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      out.set(key, value);
    }
  });
  return out;
}

async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
  const upstreamPath = "/" + path.join("/");
  const search = req.nextUrl.search ?? "";
  const upstreamUrl = `${BACKEND_ORIGIN}${upstreamPath}${search}`;

  const upstreamHeaders = buildUpstreamHeaders(req.headers);

  let body: BodyInit | undefined;
  const method = req.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    body = await req.arrayBuffer();
  }

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl, {
      method,
      headers: upstreamHeaders,
      body,
      // Disable Next.js cache so live/streaming endpoints are always fresh
      cache: "no-store",
      // @ts-expect-error - Node.js fetch extension to disable response decompression
      compress: false,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream unreachable";
    return NextResponse.json(
      { ok: false, error: { code: "network_error", message } },
      { status: 502 }
    );
  }

  // Forward the upstream response, including its headers.
  const responseBody = await upstreamRes.arrayBuffer();
  const responseHeaders = new Headers();
  upstreamRes.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  return new NextResponse(responseBody, {
    status: upstreamRes.status,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function OPTIONS(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
