# Upload (Multipart → Backend)

This project uploads videos from the browser to the backend using `multipart/form-data` (`POST /videos/upload`).
The backend then uploads to S3 and starts processing (transcoding/HLS).

## Frontend env

- `NEXT_PUBLIC_API_BASE` — set to your backend base URL (example: `http://localhost:3001`)

## Auth

Your backend endpoints are protected by `PasetoAuthGuard`, so the frontend sends:

- `Authorization: Bearer <accessToken>`

The access token is saved to localStorage on login in `streaming-ui/app/login/page.tsx`.

## `POST /videos/upload`

**Purpose:** Upload a single video file (protected route).

**Request** (`multipart/form-data`)
- `file` (video file) ✅
- `title` (string) ✅
- `description` (string) ❌
- `tags` (string[]) ❌ (sent as repeated `tags` fields)
- `videoExt` (string) ✅ (one of: `mp4`, `webm`, `mov`)
- `isPublic` (boolean) ❌ (some NestJS validators require backend-side boolean conversion for multipart)

**Response**
```json
{ "videoId": 12, "status": "processing" }
```

The UI implementation lives in `streaming-ui/app/upload/page.tsx` and uses axios `onUploadProgress` for the progress bar.
