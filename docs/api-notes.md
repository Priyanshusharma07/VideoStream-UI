# StreamHub — API Reference & Frontend Integration Notes

> **Focus:** Video playback + live streaming. Payments & notifications excluded.
> **Backend base URL:** `NEXT_PUBLIC_API_BASE` (defaults to `http://localhost:3001`)

---

## Status Legend

| Symbol | Meaning |
|---|---|
| ✅ | Backend exists & frontend wired |
| ⚠️ | Backend exists but frontend still uses demo data |
| 🔴 | Not built yet |
| ⛔ | Out of scope (excluded) |

---

## 1. Auth

| Status | Method | Endpoint | Used By | Notes |
|---|---|---|---|---|
| ✅ | `POST` | `/auth/register` | `signup/page.tsx` | Returns `accessToken`, `refreshToken`, `expiresAt`, `user` |
| ✅ | `POST` | `/auth/login` | `login/page.tsx` | Same response shape |
| ✅ | `POST` | `/auth/forgot-password` | `forgot-password/page.tsx` | Sends reset email |
| 🔴 | `POST` | `/auth/refresh` | `lib/auth-session.ts` | Token refresh — not yet implemented |

**Token storage:** `localStorage` — keys `sh_access`, `sh_refresh`, `sh_expires_at`
**Header:** `Authorization: Bearer <token>`

---

## 2. Feed

| Status | Method | Endpoint | Used By | Notes |
|---|---|---|---|---|
| ✅ | `GET` | `/feed` | `app/feed/page.tsx` | `{ trendingTitle, trending[], forYou[], forYouFilters[], subscriptions[] }` |
| ⚠️ | `GET` | `/feed?category=Gaming` | `app/discover/page.tsx` | Discover still uses demo — needs `?category` support |

```json
// GET /feed response
{
  "trendingTitle": "Trending Now",
  "trending": [{ "id": "1", "title": "...", "thumbnailUrl": "...", "kind": "video",
    "creator": { "id": "5", "name": "John", "avatarUrl": "" }, "viewsLabel": "1.2K views" }],
  "forYou": [...same shape...],
  "forYouFilters": ["All", "Gaming", "Music"],
  "subscriptions": []
}
```

---

## 3. Videos (VOD)

| Status | Method | Endpoint | Used By | Notes |
|---|---|---|---|---|
| ✅ | `POST` | `/videos/upload` | `upload/page.tsx` | Multipart: `file`, `title`, `description?`, `tags[]?` → `{ videoId, status }` |
| ✅ | `GET` | `/videos/:id` | `watch/[id]`, `videos/[id]` | Full watch payload — video + chat + playback |
| ✅ | `GET` | `/videos/:id/status` | `VideoPlayer.tsx` | Polling — `{ id, status, hlsReady, hlsManifestPath }` |
| ✅ | `POST` | `/videos/:id/view` | `watch/[id]/page.tsx` | Fire-and-forget view increment |
| ✅ | `POST` | `/videos/:id/like` | `WatchActions.tsx` | Auth required → `{ ok, liked, likesLabel }` |
| ✅ | `POST` | `/videos/:id/unlike` | `WatchActions.tsx` | Auth required |
| ⚠️ | `GET` | `/dashboard` | `dashboard/page.tsx` | Endpoint exists, page still uses `getDemoDashboard()` |
| ⚠️ | `GET` | `/search?q=...` | `explore/page.tsx` | Endpoint exists, explore page still uses demo |
| 🔴 | `POST` | `/videos/:id/comments` | `ChatPanel.tsx` | Post comment (currently local-only) |
| 🔴 | `GET` | `/videos/:id/comments` | `ChatPanel.tsx` | Paginated comment fetch |
| 🔴 | `GET` | `/videos/mine` | `dashboard/page.tsx` | Creator's own video list |
| 🔴 | `DELETE` | `/videos/:id` | Dashboard | Delete video |

```json
// GET /videos/:id response
{
  "video": {
    "id": 1, "title": "Demo", "description": "...", "tags": ["gaming"],
    "thumbnailUrl": "https://s3-signed-url...", "durationLabel": "12:34",
    "kind": "video", "category": "Gaming",
    "creator": { "id": 5, "name": "John", "avatarUrl": null },
    "viewsLabel": "1.2K views", "uploadedLabel": "2 days ago",
    "likesLabel": "340", "status": "ready"
  },
  "chat": {
    "viewersLabel": "1.2K viewers",
    "messages": [{ "id": "1", "user": { "name": "Alex", "badge": "mod" }, "message": "hey!", "highlighted": false }]
  },
  "playback": {
    "status": "ready",
    "hlsManifestPath": "/videos/1/playback/master.m3u8"
  }
}
```

---

## 4. HLS Playback

| Status | Method | Endpoint | Notes |
|---|---|---|---|
| ✅ | `GET` | `/videos/:id/playback/master.m3u8` | Backend proxies from S3, rewrites segment URIs |
| ✅ | `GET` | `/videos/:id/playback/hls/*hlsPath` | Sub-playlists + `.ts` segments → 302 to signed S3 URL |

**Flow:**
1. `GET /videos/:id` → `playback.hlsManifestPath = "/videos/1/playback/master.m3u8"`
2. Build: `${NEXT_PUBLIC_API_BASE}/videos/1/playback/master.m3u8`
3. Pass to `hls.js` → fetches master playlist
4. Backend rewrites segment URIs → `/videos/:id/playback/hls/<file>`
5. `hls.js` fetches segment → backend 302 → signed S3 URL (60s TTL)

---

## 5. Live Streaming — 🔴 Phase 2

> Not built. Frontend pages don't exist yet.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/streams` | Start stream → `{ streamId, streamKey, rtmpUrl, watchUrl }` |
| `GET` | `/streams` | List active live streams |
| `GET` | `/streams/:id` | Stream detail + viewer count |
| `DELETE` | `/streams/:id` | End stream |
| `GET` | `/streams/:id/playback` | Low-latency HLS URL |
| WebSocket | `ws://…/streams/:id/chat` | Real-time chat + viewer count push |

**Pages to build (Phase 2):**
- `/go-live` — Creator: RTMP key, stream title, start/stop button
- `/live/[id]` — Viewer: low-latency HLS player + WebSocket chat panel

---

## 6. Search

| Status | Method | Endpoint | Notes |
|---|---|---|---|
| ⚠️ | `GET` | `/search?q=<query>` | Backend exists. `explore/page.tsx` still uses demo. |

```json
{ "items": [{ "id": "1", "title": "Elden Ring Guide", "kind": "video", "creator": "Priya", "durationLabel": "5:22" }] }
```

---

## 7. User / Profile — 🔴 Not Built

| Method | Endpoint | Notes |
|---|---|---|
| `GET` | `/user/me` | Current user info — needed for dashboard, sidebar avatar |
| `PATCH` | `/user/me` | Update display name, avatar |
| `GET` | `/user/:id/videos` | Public video list for creator profile page |

---

## 8. Page Status Table

| Page | Route | Status | Next Action |
|---|---|---|---|
| Home | `/` | ✅ Static | — |
| Login | `/login` | ✅ Wired | — |
| Signup | `/signup` | ✅ Wired | — |
| Forgot Password | `/forgot-password` | ✅ Wired | — |
| Feed | `/feed` | ✅ Wired | — |
| Watch | `/watch/[id]` | ✅ Wired | — |
| Watch (alt) | `/videos/[id]` | ✅ Wired | — |
| Upload | `/upload` | ✅ Wired | — |
| Dashboard | `/dashboard` | ⚠️ Demo | Wire → `GET /dashboard` |
| Discover | `/discover` | ⚠️ Demo | Wire → `GET /feed` |
| Explore / Search | `/explore` | ⚠️ Demo | Wire → `GET /search?q=` |
| Watchlist | `/watchlist` | 🔴 Full demo | Needs watchlist API |
| Go Live | (missing) | 🔴 Not built | Phase 2 |
| Live Viewer | (missing) | 🔴 Not built | Phase 2 |
| Notifications | `/notifications` | ⛔ Excluded | — |
| Billing | `/billing` | ⛔ Excluded | — |

---

## 9. Frontend Services Map

```
services/
├── api-client.ts      getApi(), postApi()  — base HTTP wrappers
├── auth-client.ts     login(), signup(), forgotPassword()
├── videos-client.ts   uploadVideoMultipart()
│                      getVideoDetails()        → GET /videos/:id
│                      pollVideoStatus()        → GET /videos/:id/status
│                      recordView()             → POST /videos/:id/view
│                      (like/unlike via postApi from WatchActions)
└── upload-client.ts   (legacy — overlaps with videos-client)
```

---

## 10. Environment Variables

```env
# .env.local in /streaming-ui
NEXT_PUBLIC_API_BASE=http://localhost:3001   # No trailing slash
NEXT_PUBLIC_API_PREFIX=/api                  # For same-origin proxy (optional)
NEXT_PUBLIC_API_DEBUG=1                      # Logs all requests to console
```
