# StreamHub Frontend — Project Context

Last updated: 2026-04-07

## What we’re building

**StreamHub** is a modern **YouTube-like / streaming** frontend:

- Browse a feed (trending + “For you”)
- Search/explore content and categories
- Watch video playback via **HLS**
- Upload videos (backend handles storage + transcoding/HLS)
- Creator dashboard (library + stats)
- Secondary product surfaces: watchlist, notifications, billing/subscription UI

## Where we are (current state)

### Tech stack

- Next.js **App Router** (`app/`) + React + TypeScript
- Tailwind CSS
- `hls.js` for HLS playback (`components/video/HlsPlayer.tsx`)
- `axios` for upload progress (`services/videos-client.ts`)

### Repo layout (this workspace)

The actual Next.js app lives under `streaming-ui/`.

- `streaming-ui/app/` — routes/pages
- `streaming-ui/components/` — UI components
- `streaming-ui/services/` — API clients (`services/api-client.ts`, `services/auth-client.ts`, `services/videos-client.ts`)
- `streaming-ui/lib/` — helpers + demo data + localStorage auth session (`lib/auth-session.ts`)
- `streaming-ui/app/api/` — **local mock API** (Next.js Route Handlers) for demo/dev without backend
- `streaming-ui/docs/` — project docs (`docs/STRUCTURE.md`, `docs/api/*`)

### Environments / API modes

There are effectively **two modes**:

1. **Backend mode (real API)**
   - Controlled by `NEXT_PUBLIC_API_BASE`
   - In this repo there is a checked-in `streaming-ui/.env` with:
     - `NEXT_PUBLIC_API_BASE=http://localhost:3001`
   - Pages like `app/feed/page.tsx`, `app/videos/[id]/page.tsx`, and upload logic use this base.

2. **Mock mode (local demo API inside Next.js)**
   - Implemented under `streaming-ui/app/api/*`
   - `services/api-client.ts` automatically falls back to calling `/api/...` when `NEXT_PUBLIC_API_BASE` is not set.
   - Several UI screens still use demo data from `lib/demo/content` or call `/api/...` directly.

### Implemented routes (UI is mostly complete)

Landing + auth:

- `/` — marketing/hero landing (`app/page.tsx`)
- `/login` — login UI, saves tokens to localStorage (`app/login/page.tsx`, `lib/auth-session.ts`)
- `/signup` — signup UI (currently redirects to login after success) (`app/signup/page.tsx`)
- `/forgot-password` — forgot password UI (`app/forgot-password/page.tsx`)

Core streaming UX:

- `/feed` — feed UI (currently fetches from `NEXT_PUBLIC_API_BASE + /feed`) (`app/feed/page.tsx`)
- `/discover` — category + trending live UI (demo data) (`app/discover/page.tsx`)
- `/explore` — search UI (calls mock `/api/search`) (`app/explore/page.tsx`)
- `/videos/:id` — **backend-integrated** watch page (expects `/videos/:id` returning HLS manifest path) (`app/videos/[id]/page.tsx`)
- `/watch/:id` — **demo** watch page (no HLS, uses demo content) (`app/watch/[id]/page.tsx`)

Creator / account surfaces:

- `/upload` — upload UI (multipart upload to backend) (`app/upload/page.tsx`, `services/videos-client.ts`)
- `/dashboard` — creator dashboard UI (demo data) (`app/dashboard/page.tsx`)
- `/watchlist` — watchlist UI (demo data) (`app/watchlist/page.tsx`)
- `/notifications` — notifications UI (static demo list) (`app/notifications/page.tsx`)
- `/billing` — billing/subscription UI (static demo list) (`app/billing/page.tsx`)

### What’s “wired” vs “demo” today

- **Backend-wired**
  - Login request uses `services/auth-client.ts` which calls either:
    - `/api/auth/login` (mock mode), or
    - `${NEXT_PUBLIC_API_BASE}/auth/login` (backend mode)
  - Upload uses multipart POST to `${NEXT_PUBLIC_API_BASE}/videos/upload`
  - `/feed` and `/videos/:id` pages call `${NEXT_PUBLIC_API_BASE}/feed` and `${NEXT_PUBLIC_API_BASE}/videos/:id`

- **Demo / mock**
  - `/explore` uses `/api/search` directly
  - `/discover`, `/watch`, `/dashboard`, `/watchlist` use `lib/demo/content`
  - Billing + notifications are currently static UI
  - Watch actions (subscribe/like/share/tip) are “demo” toggles with toast messages
  - Live chat is local-only (adds “You” messages in-memory)

## What’s pending (work still to do)

### 1) Decide + unify the data source strategy

Right now the app is partially “backend mode” and partially “mock/demo mode”.

- Make a clear choice:
  - Keep a **mock-first** dev workflow and ensure every page uses `services/api-client.ts` (so it auto-switches to `/api/...` when no backend is configured), OR
  - Go **backend-first** and update the remaining demo screens to call real endpoints via `NEXT_PUBLIC_API_BASE`.

### 2) Authentication hardening (required for “real” product)

- Add a proper “protected route” pattern (upload/dashboard/billing, etc.)
- Decide token handling strategy:
  - current: tokens stored in localStorage (`lib/auth-session.ts`)
  - production: consider httpOnly cookies + refresh flow
- Implement logout + session expiry handling
- Add a global `401` strategy (refresh token or redirect to `/login`)

### 3) Video watching flow

- Unify `/watch/:id` (demo) vs `/videos/:id` (backend HLS) into one consistent path and model
- For processing videos:
  - poll/refetch until `status=ready` and `hlsManifestPath` is present, or add SSE/websocket updates
- Confirm CORS + HLS hosting behavior (manifest + segment URLs)

### 4) Upload flow completeness

- Decide which upload approach is “the one”:
  - multipart to backend (`POST /videos/upload`) — already implemented in UI
  - presigned S3 upload (`services/upload-client.ts` + `lib/s3-upload.ts` + `app/api/uploads/*`) — currently unused by the upload page
- Add thumbnail upload path if required by backend
- Support visibility (`public/unlisted/private`) end-to-end (currently blocked by backend boolean parsing constraints)

### 5) Finish backend integration for remaining screens

- `/explore` — replace `/api/search` with real search endpoint when available
- `/discover` — fetch categories/trending from backend
- `/dashboard` — replace demo data with backend `/dashboard`
- `/watchlist`, `/notifications`, `/billing` — decide persistence + APIs (or keep as later-phase)

### 6) Live / social features (later-phase)

- Real-time chat (websocket), moderation, viewer counts
- Subscribe/like/share/tipping actions (currently demo toasts)
- “Go Live” UX (currently just links to dashboard)

## Quick start (local)

From the repo root:

1. `cd streaming-ui`
2. `npm install`
3. Ensure `NEXT_PUBLIC_API_BASE` is set appropriately (backend mode) or unset (mock mode)
4. `npm run dev`

## References

- Structure: `streaming-ui/docs/STRUCTURE.md`
- API contracts (mock): `streaming-ui/docs/api/README.md`
