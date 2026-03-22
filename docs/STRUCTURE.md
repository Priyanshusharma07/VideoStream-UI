# Project Structure

This repo uses the Next.js **App Router**. UI/UX is unchanged; this is only an organization guide.

## Folders

- `app/` — routing + pages (Next.js App Router)
  - `app/api/` — local demo/mock Route Handlers (optional)
- `components/` — reusable UI components (presentational + small client widgets)
- `services/` — backend API clients (fetch/axios wrappers, auth/video calls)
- `hooks/` — custom React hooks (currently minimal)
- `lib/` — non-UI helpers (demo data, localStorage session helpers, misc utilities)
- `types/` — shared TypeScript types for API payloads
- `styles/` — global styles (Tailwind entry + global CSS)
- `public/` — static assets

## Key files

- Auth token storage: `lib/auth-session.ts`
- API helpers: `services/api-client.ts`
- Auth API client: `services/auth-client.ts`
- Video API client (includes multipart upload): `services/videos-client.ts`
- Upload page: `app/upload/page.tsx`
- Watch page: `app/videos/[id]/page.tsx`

