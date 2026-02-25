# Content API (Demo Contract)

These endpoints return **demo data** (including local thumbnail URLs in `/public/demo/...`) so frontend pages can be built before the backend is ready.

Base URL (local): `http://localhost:3000`

## Common response shape

```json
{ "ok": true, "data": {} }
```

or

```json
{
  "ok": false,
  "error": { "code": "some_code", "message": "Human readable message" }
}
```

## GET `/api/feed`

### Success `200`

Returns:

- `trendingTitle` (string)
- `trending[]` (videos)
- `forYou[]` (videos)
- `forYouFilters[]` (strings)
- `subscriptions[]` (creators)

## GET `/api/videos/:id`

### Success `200`

Returns a single `video` (with `description`, `tags`, `likesLabel`) and a `chat` object:

- `chat.viewersLabel` (string)
- `chat.messages[]` (id, user, message, optional highlighted)

## GET `/api/dashboard`

### Success `200`

Returns:

- `user` (name, handle, avatarUrl, planName)
- `stats[]` (label, value, deltaLabel)
- `recentHistory[]` (title, meta, thumbnailUrl, progress 0..1)

