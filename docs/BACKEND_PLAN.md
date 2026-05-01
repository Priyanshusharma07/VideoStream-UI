# StreamHub — Backend API + Entities Plan (based on current frontend)

Last reviewed: 2026-04-29  
Frontend repo: `streaming-ui/` (Next.js App Router)

This document is an **implementation plan** for the backend API + database entities, derived from what the current frontend already calls / renders. It also highlights gaps and inconsistencies so we can converge on one clean contract.

---

## 0) What the frontend looks like today (routes + data needs)

### “Backend-integrated” routes (already calling `NEXT_PUBLIC_API_BASE` via `services/*`)
- `/feed` — uses `GET /feed` and expects `FeedPayload` (trending + forYou + subscriptions)  
  Frontend: `app/feed/page.tsx`, `services/feed-client.ts`, `types/content.ts`
- `/watch/[id]` and `/videos/[id]` — watch page uses:
  - `GET /videos/:id` → `WatchPagePayload`
  - `GET /videos/:id/status` → poll until HLS ready
  - `POST /videos/:id/view` → fire-and-forget
  - `POST /videos/:id/like` / `POST /videos/:id/unlike`
  Frontend: `app/watch/[id]/page.tsx`, `app/videos/[id]/page.tsx`, `services/videos-client.ts`, `types/watch.ts`

### Upload route (currently using a different upload strategy)
- `/upload` — currently uses **presigned S3** flow from `services/video.service.ts`:
  1) `POST /videos/upload-url` (get presigned PUT + S3 key)
  2) `PUT <presignedUrl>` (browser → S3)
  3) `POST /videos` (confirm + create DB record)
  Frontend: `app/upload/page.tsx`, `services/video.service.ts`

> Note: the repo also contains a *second* upload client (`services/videos-client.ts`) that supports `POST /videos/upload` multipart. Decide which approach is canonical (recommendation in section 3).

### Demo-only routes (mock data / localStorage)
- `/` + `/video/[id]` + `/live` — use `src/services/videoService.ts` (in-memory dataset)
- `/explore` — uses mock `GET /api/search` (Next Route Handler), not backend `/search` yet
- `/dashboard` — uses demo `getDemoDashboard()`, not backend `/dashboard` yet
- `/watchlist` — localStorage watchlist (`src/services/watchlistService.ts`)
- `/notifications`, `/billing` — static UI

---

## 1) Canonical response shapes (recommendation)

The frontend already supports a consistent wrapper via `ApiResult<T>`:

- Success: `{ ok: true, data: T }`
- Failure: `{ ok: false, error: { code: string, message: string, fieldErrors?: Record<string,string> } }`

Recommendation:
- Use `ApiResult<T>` **for all JSON endpoints**.
- Use normal HTTP status codes (`400/401/403/404/409/422/500`), but still return the wrapper.

---

## 2) Core domain entities (DB model)

This is the minimal set that maps cleanly to the frontend screens + expected growth (comments, watchlist, live, etc).

### `User`
- `id` (uuid / int), `email`, `passwordHash`
- `displayName`, `handle` (unique), `avatarKey` (S3 key) or `avatarUrl`
- `role` (`user` | `creator` | `admin`), `createdAt`, `updatedAt`

### `Session` (if using refresh tokens)
- `id`, `userId`, `refreshTokenHash`, `expiresAt`, `revokedAt`, `createdAt`

### `Video`
- `id` (int / uuid), `userId` (owner/creator)
- `title`, `description`, `visibility` (`public` | `unlisted` | `private`)
- `status` (`uploading` | `processing` | `ready` | `failed`)
- `category` (string) or `categoryId`
- `durationSeconds`, `createdAt`, `publishedAt`

### `VideoAsset`
Stores storage keys and derived assets.
- `videoId`
- `originalKey` (S3 key), `originalContentType`, `originalSizeBytes`
- `thumbnailKey` (S3 key)
- `hlsMasterKey` (S3 key) OR `hlsManifestPath` (backend path that proxies/rewrites)
- optional: `renditions[]` metadata (heights/bitrates)

### `VideoTag` (many-to-many)
- `videoId`, `tag` (string)  (or split into `Tag` + join table later)

### `VideoLike`
- `userId`, `videoId`, `createdAt`

### `VideoView` (event) + `VideoViewAggregate` (optional)
- event: `id`, `videoId`, `userId?`, `ipHash?`, `userAgentHash?`, `createdAt`
- aggregate: `videoId`, `viewsCount`, `updatedAt`

### `Follow` (creator subscriptions)
- `followerUserId`, `creatorUserId`, `createdAt`

### `WatchHistory`
- `userId`, `videoId`, `progressSeconds`, `updatedAt`

### `Watchlist`
- `userId`, `videoId`, `createdAt`

### `Comment` (for VOD) / `ChatMessage` (for Live)
- VOD comments: `id`, `videoId`, `userId`, `message`, `createdAt`
- Live chat: `id`, `streamId`, `userId`, `message`, `createdAt`

### `LiveStream` (Phase 2)
- `id`, `creatorUserId`
- `title`, `status` (`live` | `ended`), `streamKey`, `rtmpUrl`
- `hlsPlaybackUrl` or `hlsMasterKey`, `startedAt`, `endedAt`

---

## 3) API surface (what the backend should expose)

### 3.1 Auth
Used by `services/auth-client.ts`.

- `POST /auth/register` → `{ accessToken, refreshToken?, expiresAt, user }`
- `POST /auth/login` → same shape
- `POST /auth/forgot-password` → `{ status: "ok" }`
- `POST /auth/refresh` → (recommended) rotate refresh token, return new access token
- `POST /auth/logout` → revoke refresh token (optional)
- `GET /user/me` → current user profile (sidebar/avatar/dashboard)

### 3.2 Feed + discovery
Used by `services/feed-client.ts` and UI pages.

- `GET /feed`
  - query: `cursor?`, `limit?`, `category?`, `kind?` (`video|live`)
  - response: `FeedPayload`
- (optional) `GET /categories` → list categories + counts

### 3.3 Search
`/explore` currently calls `/api/search` (mock). Replace with backend:

- `GET /search?q=...`
  - query: `q`, `cursor?`, `limit?`, `kind?`, `creatorId?`
  - response: `{ items: Array<...> }` (match what Explore needs)

### 3.4 Videos (watch page)
Used by `services/videos-client.ts`, `components/video/VideoPlayer.tsx`, `components/watch/WatchActions.tsx`.

- `GET /videos/:id` → `WatchPagePayload`
  - must include: `video.*`, `chat.messages[]` (can be empty), `playback.status`, and `playback.hlsManifestPath`
- `GET /videos/:id/status` → `VideoStatusPayload`
  - must include `hlsManifestPath` once ready
- `POST /videos/:id/view` → `{ status: "ok" }` (fire-and-forget)
- `POST /videos/:id/like` → `{ likesLabel: string }`
- `POST /videos/:id/unlike` → `{ likesLabel: string }`
- (future) `GET /videos/:id/comments?cursor=...`
- (future) `POST /videos/:id/comments`

### 3.5 Upload (choose ONE canonical strategy)

The repo currently contains **two** approaches:

**A) Presigned S3 (recommended for large files)**
- `POST /videos/upload-url`
  - body: `{ videoExt, contentType, thumbnailExt? }`
  - response: `{ videoId?, videoUploadUrl, videoKey, thumbnailUploadUrl?, thumbnailKey? }`
- `PUT <videoUploadUrl>` (direct to S3)
- `POST /videos` (confirm/create)
  - body: `{ title, fileKey, description?, tags?, visibility }`
  - response: `{ videoId, status }`

**B) Multipart upload to backend (simpler to implement, heavier on your server)**
- `POST /videos/upload` (multipart)
  - fields: `file`, `title`, `description?`, repeated `tags`, `visibility`/`isPublic`
  - response: `{ videoId, status }`

Recommendation: pick **A** long-term, keep **B** only for local/dev or fallback.

### 3.6 Playback (HLS)
To work well with `hls.js`, the browser must be able to fetch the manifest + segments.

Two viable patterns:

**Pattern 1 (recommended): backend proxy + rewrite**
- `GET /videos/:id/playback/master.m3u8`
- `GET /videos/:id/playback/hls/*` (sub-playlists + segments)
  - backend can `302` to short-lived signed S3 URLs

**Pattern 2: signed URL returned directly**
- `GET /videos/:id` returns `playback.signedUrl` (full HLS master URL, short TTL)
  - requires segment URLs in the playlist to also be accessible (often still needs proxy/rewrite)

The frontend already supports `playback.hlsManifestPath` and will prefix with `NEXT_PUBLIC_API_BASE` when it’s a relative path.

### 3.7 Creator dashboard
`/dashboard` UI exists but is still demo.

- `GET /dashboard`
  - response: user card + stats + recent history (+ optionally creator’s own videos)
- (optional) `GET /videos/mine` (creator library)
- (optional) `DELETE /videos/:id` (delete)
- (optional) `PATCH /videos/:id` (edit metadata)

### 3.8 Watchlist + history (optional but recommended)
Today watchlist is localStorage only.

- `GET /watchlist`
- `POST /watchlist/:videoId`
- `DELETE /watchlist/:videoId`
- `GET /history`
- `POST /history/:videoId` (or update via view endpoint with progress)

### 3.9 Live streaming (Phase 2)
Frontend has demo `/live`, but real “Go Live” isn’t built yet.

- `POST /streams` → `{ streamId, streamKey, rtmpUrl, watchUrl }`
- `GET /streams` (browse live)
- `GET /streams/:id` (detail)
- `DELETE /streams/:id` (end)
- `GET /streams/:id/playback` (LL-HLS URL or proxy path)
- WebSocket: `/streams/:id/chat` (chat + viewer count)

---

## 4) Integration plan (phased, practical)

### Phase 1 — “Make backend-first consistent”
1. Decide canonical watch route: keep only one of `/watch/[id]` vs `/videos/[id]`.
2. Decide canonical upload strategy (presigned vs multipart) and delete/retire the other client paths.
3. Make `/explore` call backend `GET /search` via `services/api-client.ts` (stop direct `/api/search` usage).
4. Wire `/dashboard` to backend `GET /dashboard` (stop `getDemoDashboard()`).

### Phase 2 — “Complete the VOD loop”
1. Implement comments API (or “chat replay”) and connect `ChatPanel` to real data.
2. Implement follow/subscribe API and make Subscribe real.
3. Add `GET /user/me` and show the real user in sidebar/topbar.

### Phase 3 — “Product features”
1. Persist watchlist + watch history server-side.
2. Recommendations (“Up next”) + related videos endpoint.
3. Notifications (optional) + real-time events.

### Phase 4 — “Live streaming”
1. Add creator “Go Live” UI + backend stream lifecycle.
2. WebSocket chat + viewer counts + moderation.

---

## 5) Open decisions (need your confirmation)

1. IDs: do we standardize on `uuid` or numeric IDs for videos/users?
2. Visibility: do we want `public/unlisted/private` (recommended) or only `isPublic` boolean?
3. Upload: are we committing to presigned direct-to-S3 as the primary path?
4. Auth: keep localStorage (current) or move to httpOnly cookies + refresh flow?

