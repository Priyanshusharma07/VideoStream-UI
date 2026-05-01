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
    label: "Home (Cinematic Feed)",
    kind: "public",
    check: ["Glass-morphic Topbar renders", "Video cards are interactive"],
  },
  {
    path: "/live",
    label: "Live Broadcasts",
    kind: "public",
    check: ["Active viewers count visible", "HLS playback loads"],
  },
  {
    path: "/watch/live-coding-nextjs",
    label: "Watch (Cinematic Player)",
    kind: "app",
    check: ["Player controls work", "Live Chat renders"],
  },
  {
    path: "/login",
    label: "Login (Cinematic)",
    kind: "auth",
    notes: "Demo credentials: demo@cineview.com / demo1234",
    check: ["Sign in redirects to /feed", "Theme toggle works"],
  },
  {
    path: "/signup",
    label: "Create Account",
    kind: "auth",
    check: ["Branded entry point renders", "Redirect to /feed on success"],
  },
  {
    path: "/forgot-password",
    label: "Recover Access",
    kind: "auth",
    check: ["Glass-panel design system applied"],
  },
  {
    path: "/profile",
    label: "User Profile (Immersive)",
    kind: "app",
    check: ["Banner and stats render", "Tabs switch content"],
  },
  {
    path: "/feed",
    label: "Discover Feed",
    kind: "app",
    check: ["Personalized grids render"],
  },
  {
    path: "/upload",
    label: "Content Studio (Upload)",
    kind: "app",
    check: ["Drag & drop works", "Progress bar updates"],
  },
  {
    path: "/dashboard",
    label: "Creator Hub (Dashboard)",
    kind: "app",
    check: ["Analytics cards render", "Quick actions work"],
  },
  {
    path: "/discover",
    label: "Global Discover",
    kind: "app",
    check: ["Glass-cards for categories render"],
  },
  {
    path: "/watchlist",
    label: "My Watchlist",
    kind: "app",
    check: ["Saved videos grid renders"],
  },
  {
    path: "/notifications",
    label: "Activity Center",
    kind: "public",
    check: ["Centralized notification feed renders"],
  },
  {
    path: "/billing",
    label: "Subscription Manager",
    kind: "app",
    check: ["Plan selection works"],
  },
];


