export type RouteKind = "public" | "auth" | "app" | "demo-api";

export type AppRoute = {
  path: string;
  label: string;
  kind: RouteKind;
  notes?: string;
  check?: string[];
};

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Home (Mock Video Grid)",
    kind: "public",
    check: ["Video cards render", "Click a card → /video/[id]"],
  },
  {
    path: "/live",
    label: "Live (HLS Listing)",
    kind: "public",
    check: ["LIVE badges visible", "Click a live card → HLS playback"],
  },
  {
    path: "/video/edu-nextjs-app-router",
    label: "Video Detail (MP4 demo)",
    kind: "public",
    check: ["Player loads", "Recommended renders"],
  },
  {
    path: "/video/live-coding-nextjs",
    label: "Video Detail (HLS demo)",
    kind: "public",
    check: ["HLS player loads (hls.js)", "Recommended renders"],
  },
  {
    path: "/login",
    label: "Login",
    kind: "auth",
    notes: "Demo credentials: demo@streamhub.com / demo1234",
    check: ["Sign in redirects to /feed", "Social buttons show toast"],
  },
  {
    path: "/signup",
    label: "Signup",
    kind: "auth",
    check: ["Submit shows success", "Redirect to /login"],
  },
  {
    path: "/forgot-password",
    label: "Forgot Password",
    kind: "auth",
    check: ["Valid email → success", "Invalid email → error"],
  },
  {
    path: "/feed",
    label: "Feed (Demo API)",
    kind: "app",
    check: ["Sidebar renders", "Click a video → /watch/[id]"],
  },
  {
    path: "/watch/v-1",
    label: "Watch (Demo HLS playback)",
    kind: "app",
    check: ["Player shows", "Like/Share/Subscribe buttons work"],
  },
  {
    path: "/videos/v-1",
    label: "Watch (Alt route)",
    kind: "app",
    check: ["Same as /watch/[id]"],
  },
  {
    path: "/upload",
    label: "Upload",
    kind: "app",
    check: ["Upload simulates progress", "Redirect to /videos/v-upload-*"],
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    kind: "app",
    check: ["Cards render", "Upload button navigates to /upload"],
  },
  {
    path: "/discover",
    label: "Discover",
    kind: "app",
    check: ["Categories link to /explore?q=..."],
  },
  {
    path: "/explore?q=cy",
    label: "Explore (Search)",
    kind: "public",
    check: ["Search results appear", "Watch link navigates to /watch/[id]"],
  },
  {
    path: "/watchlist",
    label: "Watchlist",
    kind: "app",
    check: ["Remove button works", "Continue-watching links work"],
  },
  {
    path: "/notifications",
    label: "Notifications",
    kind: "public",
    check: ["Page renders"],
  },
  {
    path: "/billing",
    label: "Billing",
    kind: "public",
    check: ["Page renders"],
  },
  {
    path: "/api/health",
    label: "API: Health",
    kind: "demo-api",
    check: ["Returns ok=true JSON"],
  },
  {
    path: "/api/feed",
    label: "API: Feed",
    kind: "demo-api",
    check: ["Returns ok=true JSON"],
  },
  {
    path: "/api/videos/v-1",
    label: "API: Video detail",
    kind: "demo-api",
    check: ["Returns ok=true JSON with playback"],
  },
  {
    path: "/api/videos/v-1/status",
    label: "API: Video status",
    kind: "demo-api",
    check: ["Returns ok=true JSON with hlsManifestPath"],
  },
  {
    path: "/api/search?q=cy",
    label: "API: Search",
    kind: "demo-api",
    check: ["Returns ok=true JSON with items"],
  },
];

