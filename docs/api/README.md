# StreamHub API Documentation

> **Status:** Demo / Mock — all endpoints are implemented as Next.js Route Handlers inside `app/api/`.  
> They return realistic data so the UI can be developed and tested without a real backend.  
> When a real backend is ready, set `NEXT_PUBLIC_API_BASE` and/or adjust the API helpers in `services/api-client.ts` and `services/auth-client.ts`.

---

## Base URL

| Environment | URL |
|-------------|-----|
| Local dev   | `http://localhost:3000` |
| Production  | `https://<your-domain>` |

---

## Common Response Shape

Every endpoint returns a JSON object that always has an `ok` boolean:

```ts
// Success
{ "ok": true, "data": <payload> }

// Failure
{
  "ok": false,
  "error": {
    "code": "error_code",        // machine-readable slug
    "message": "Human message.", // user-facing string
    "fieldErrors": {             // optional, only on validation_error
      "email": "Enter a valid email."
    }
  }
}
```

TypeScript types live in `types/api.ts`, `types/auth.ts`, `types/content.ts`, and `types/upload.ts`.

---

## Auth Endpoints

### `POST /api/auth/login`

**Purpose:** Authenticate an existing user and receive access + refresh tokens.

| Field       | Type    | Required | Rules |
|-------------|---------|----------|-------|
| `email`     | string  | ✅ | Valid email format |
| `password`  | string  | ✅ | Min 6 characters |
| `remember`  | boolean | ❌ | Extend session duration (future use) |

**Request**
```json
{
  "email": "demo@streamhub.com",
  "password": "demo1234",
  "remember": true
}
```

**Success `200`**
```json
{
  "ok": true,
  "data": {
    "accessToken": "demo-access-<uuid>",
    "refreshToken": "demo-refresh-<uuid>",
    "expiresAt": "2026-02-25T16:00:00.000Z",
    "user": {
      "id": "<uuid>",
      "email": "demo@streamhub.com",
      "name": "Demo User"
    }
  }
}
```

**Error responses**
| HTTP | `code` | Cause |
|------|--------|-------|
| `400` | `validation_error` | Missing or invalid fields; `fieldErrors` populated |
| `401` | `invalid_credentials` | Email/password mismatch |

**Demo credentials**
- Email: `demo@streamhub.com`  
- Password: `demo1234`

**Used by:** `app/login/page.tsx` → `services/auth-client.ts → login()`

---

### `POST /api/auth/signup`

**Purpose:** Create a new account and immediately return tokens (auto-login on signup).

> **Alias:** `POST /api/auth/register` (same behaviour) — supported so the frontend can keep using `/auth/register` when swapping to a real backend later.

| Field      | Type   | Required | Rules |
|------------|--------|----------|-------|
| `name`     | string | ✅ | Min 2 characters |
| `email`    | string | ✅ | Valid email format |
| `password` | string | ✅ | Min 6 characters |

**Request**
```json
{
  "name": "Alex Doe",
  "email": "alex@example.com",
  "password": "secret123"
}
```

**Success `200`** — same shape as login success (auto-logs in, issues tokens immediately)
```json
{
  "ok": true,
  "data": {
    "accessToken": "demo-access-<uuid>",
    "refreshToken": "demo-refresh-<uuid>",
    "expiresAt": "2026-02-25T16:00:00.000Z",
    "user": {
      "id": "<uuid>",
      "email": "alex@example.com",
      "name": "Alex Doe"
    }
  }
}
```

**Error responses**
| HTTP | `code` | Cause |
|------|--------|-------|
| `400` | `validation_error` | Missing/invalid fields; `fieldErrors` populated |
| `409` | `email_taken` | Email already registered (demo blocks `demo@streamhub.com`) |

**Used by:** `app/signup/page.tsx` → `services/auth-client.ts → signup()`

---

### `POST /api/auth/forgot-password`

**Purpose:** Trigger a password-reset email (demo always responds success for any valid email to prevent user enumeration).

| Field   | Type   | Required | Rules |
|---------|--------|----------|-------|
| `email` | string | ✅ | Valid email format |

**Request**
```json
{ "email": "demo@streamhub.com" }
```

**Success `200`**
```json
{ "ok": true, "data": { "status": "ok" } }
```

**Error responses**
| HTTP | `code` | Cause |
|------|--------|-------|
| `400` | `validation_error` | Invalid or missing email |

**Used by:** `app/forgot-password/page.tsx` → `services/auth-client.ts → forgotPassword()`

---

## Content Endpoints

### `GET /api/feed`

**Purpose:** Return the home feed for the logged-in user — trending videos, personalised "For You" videos, category filters, and subscription list.

**No request parameters required.**

**Success `200`**
```json
{
  "ok": true,
  "data": {
    "trendingTitle": "Trending in India",
    "trending": [
      {
        "id": "v-live-1",
        "title": "Cyberpunk 2077: A cinematic run",
        "thumbnailUrl": "/demo/thumbs/thumb-06.svg",
        "kind": "live",
        "category": "Gaming",
        "creator": { "id": "c2", "name": "React Team", "avatarUrl": "/demo/avatars/avatar-02.svg", "isLive": true },
        "viewsLabel": "1.3k watching",
        "uploadedLabel": "Live now"
      }
      // ...more videos
    ],
    "forYouFilters": ["All", "Gaming", "Music", "Movies"],
    "forYou": [ /* Video[] */ ],
    "subscriptions": [
      { "id": "c3", "name": "Design Sense", "avatarUrl": "/demo/avatars/avatar-03.svg", "isLive": true }
      // ...more creators
    ]
  }
}
```

**Data types**
```ts
type VideoKind = "video" | "live";

type Creator = {
  id: string;
  name: string;
  avatarUrl: string;
  isLive?: boolean;
};

type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  durationLabel?: string;   // absent for live streams
  kind: VideoKind;
  category: string;
  creator: Creator;
  viewsLabel: string;       // e.g. "420k views" | "1.3k watching"
  uploadedLabel: string;    // e.g. "2 days ago" | "Live now"
};
```

**Used by:** `app/feed/page.tsx`, `app/discover/page.tsx`, `app/watchlist/page.tsx`

---

### `GET /api/videos/:id`

**Purpose:** Fetch full detail for a single video including description, tags, likes count, chat messages, and playback info.

**Path parameter**
| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string | Video ID (e.g. `v-1`, `v-live-1`) |

**Success `200`**
```json
{
  "ok": true,
  "data": {
    "video": {
      "id": "v-1",
      "title": "How to build a SaaS in 30 days using Next.js",
      "thumbnailUrl": "/demo/thumbs/thumb-04.svg",
      "durationLabel": "12:48",
      "kind": "video",
      "category": "Movies",
      "creator": { "id": "c1", "name": "Dev Journey", "avatarUrl": "/demo/avatars/avatar-01.svg" },
      "viewsLabel": "89k views",
      "uploadedLabel": "2 days ago",
      "description": "Welcome to the future...",
      "tags": ["Cyberpunk", "HDR", "VFX"],
      "likesLabel": "45K"
    },
    "chat": {
      "viewersLabel": "28.4K viewers",
      "messages": [
        {
          "id": "m1",
          "user": { "name": "CyberSam", "badge": "creator" },
          "message": "The lighting in this scene is absolutely insane!"
        },
        {
          "id": "m4",
          "user": { "name": "GoldGamer" },
          "message": "Just donated 500! Keep it up!",
          "highlighted": true
        }
      ]
    },
    "playback": {
      "status": "ready",
      "hlsManifestPath": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    }
  }
}
```

**Data types**
```ts
// Full contract lives in `types/video.ts`.
type MessageBadge = "mod" | "creator";   // or absent

type ChatMessage = {
  id: string;
  user: { name: string; badge?: MessageBadge };
  message: string;
  highlighted?: boolean;  // rendered with amber highlight
};
```

> **Note:** The demo ignores the `id` and returns the same data for unknown IDs (falls back to `forYou[0]`).  
> Production should return `404` for unknown IDs.

**Used by:** `app/watch/[id]/page.tsx`, `app/videos/[id]/page.tsx`

---

### `GET /api/videos/:id/status`

**Purpose:** Poll transcoding / readiness state for the player.

**Success `200`**
```json
{
  "ok": true,
  "data": {
    "id": "v-1",
    "status": "ready",
    "hlsReady": true,
    "hlsManifestPath": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  }
}
```

---

### `POST /api/videos/:id/view`

**Purpose:** Record a view (fire-and-forget). Demo endpoint is a no-op.

**Success `200`**
```json
{ "ok": true, "data": { "status": "ok" } }
```

---

### `POST /api/videos/:id/like` / `POST /api/videos/:id/unlike`

**Purpose:** Toggle like state. Demo returns a stable `likesLabel` string.

**Success `200`**
```json
{ "ok": true, "data": { "likesLabel": "46K" } }
```

---

### `GET /api/dashboard`

**Purpose:** Return the authenticated user's dashboard — profile info, stats, and recent watch history.

**No request parameters required.**

**Success `200`**
```json
{
  "ok": true,
  "data": {
    "user": {
      "name": "Alex Rivera",
      "handle": "@rivera_creations",
      "avatarUrl": "/demo/avatars/avatar-01.svg",
      "planName": "StreamHub Pro"
    },
    "stats": [
      {
        "id": "views",
        "label": "Total Video Views",
        "value": "1.2M",
        "deltaLabel": "+12.5% this week"
      },
      {
        "id": "engagement",
        "label": "Total Engagement",
        "value": "85.4K",
        "deltaLabel": "+4.2% this week"
      }
    ],
    "recentHistory": [
      {
        "id": "h1",
        "title": "Mastering Cinematic Lighting in 2024",
        "meta": "Visual Arts Mastery • 1.2M views • 2 days ago",
        "thumbnailUrl": "/demo/thumbs/thumb-03.svg",
        "progress": 0.88
      }
    ]
  }
}
```

**Data types**
```ts
type DashboardPayload = {
  user: { name: string; handle: string; avatarUrl: string; planName: string };
  stats: Array<{ id: string; label: string; value: string; deltaLabel: string }>;
  recentHistory: Array<{
    id: string; title: string; meta: string; thumbnailUrl: string;
    progress: number;  // 0.0 – 1.0 (multiply by 100 for %)
  }>;
};
```

**Used by:** `app/dashboard/page.tsx`

---

### `GET /api/search?q=<query>`

**Purpose:** Full-text search across the content catalogue.

**Query parameters**
| Param | Type   | Required | Rules |
|-------|--------|----------|-------|
| `q`   | string | ✅ | Min 2 characters |

**Success `200`**
```json
{
  "ok": true,
  "data": {
    "items": [
      { "id": "m1", "title": "Cyber City", "year": 2024, "kind": "movie" },
      { "id": "l1", "title": "Live Arena", "kind": "live" }
    ]
  }
}
```

**Data types**
```ts
type SearchItem = {
  id: string;
  title: string;
  year?: number;         // absent for live content
  kind: "movie" | "show" | "live";
};
```

**Error responses**
| HTTP | `code` | Cause |
|------|--------|-------|
| `400` | `validation_error` | `q` is missing or shorter than 2 characters |

**Used by:** `app/explore/page.tsx`, `components/home/HeroSearch.tsx`, `components/app/TopbarSearch.tsx`

---

## Health Endpoint

### `GET /api/health`

**Purpose:** Liveness probe — confirms the Next.js app is running. Used by deployment platforms, monitoring tools, and load balancers.

**No parameters required.**

**Success `200`**
```json
{
  "ok": true,
  "service": "streaming-ui",
  "status": "up"
}
```

> This endpoint does **not** follow the standard `ApiResult<T>` wrapper — it returns plain JSON for maximum compatibility with health-check tools.

---

## TypeScript Contracts

All shared types are centralised in `types/`:

| File | Contents |
|------|----------|
| `api.ts` | `ApiError`, `ApiResult<T>` |
| `auth.ts` | `LoginRequest`, `SignupRequest`, `ForgotPasswordRequest`, `AuthUser`, `LoginResponse`, `SignupResponse`, `ForgotPasswordResponse` |
| `content.ts` | `Creator`, `Video`, `VideoKind`, `FeedPayload`, `VideoDetailsPayload`, `DashboardPayload` |
| `video.ts` | `VideoCreator`, `VideoDetail`, `ChatMessage`, `WatchPagePayload`, `VideoStatusPayload` |

---

## Client Helper — `services/auth-client.ts`

Thin wrapper over `fetch` used on the client side for auth calls.

```ts
import { login, signup, forgotPassword } from "@/lib/auth-client";

// Returns ApiResult<LoginResponse>
const result = await login({ email, password });
if (result.ok) {
  console.log(result.data.user.name);
} else {
  console.error(result.error.message);
}
```

---

## Adding a New API Route

1. Create `app/api/<route>/route.ts`
2. Export `GET` and/or `POST` handler functions
3. Return `NextResponse.json(payload)` where `payload` matches `ApiResult<YourType>`
4. Add the type to `types/content.ts` (or a new types file)
5. Document it in this file

---

## Future Backend Integration Checklist

When replacing demo mocks with a real backend:

- [ ] Update base URL env variable (e.g. `NEXT_PUBLIC_API_URL`)
- [ ] Replace route handlers with `fetch` calls to the real API
- [ ] Implement token storage (httpOnly cookies recommended)
- [ ] Add `Authorization: Bearer <token>` header on authenticated routes
- [ ] Handle `401` globally (token refresh / redirect to login)
- [ ] Add real file upload endpoint (multipart/form-data) for `app/upload/`
- [ ] Replace demo search dataset with real search (Elasticsearch / Algolia / DB full-text)
- [ ] Implement real notifications via WebSocket or SSE

---

*Last updated: February 2026 — streaming-ui v0.1.0*
