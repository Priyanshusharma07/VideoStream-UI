import type {
  Creator,
  DashboardPayload,
  FeedPayload,
  VideoDetailsPayload,
} from "../contracts/content";

const creators: Creator[] = [
  { id: "c1", name: "Dev Journey", avatarUrl: "/demo/avatars/avatar-01.svg" },
  { id: "c2", name: "React Team", avatarUrl: "/demo/avatars/avatar-02.svg", isLive: true },
  { id: "c3", name: "Design Sense", avatarUrl: "/demo/avatars/avatar-03.svg" },
  { id: "c4", name: "Cosmos Now", avatarUrl: "/demo/avatars/avatar-04.svg" },
  { id: "c5", name: "BiteSized", avatarUrl: "/demo/avatars/avatar-05.svg" },
  { id: "c6", name: "Riot Games", avatarUrl: "/demo/avatars/avatar-06.svg", isLive: true },
];

export const DEMO_SUBSCRIPTIONS: Creator[] = [
  { ...creators[2], isLive: true },
  creators[4],
  creators[1],
  creators[3],
];

export function getDemoFeed(): FeedPayload {
  return {
    trendingTitle: "Trending in India",
    trending: [
      {
        id: "v-live-1",
        title: "Cyberpunk 2077: A cinematic run",
        thumbnailUrl: "/demo/thumbs/thumb-06.svg",
        kind: "live",
        category: "Gaming",
        creator: creators[1],
        viewsLabel: "1.3k watching",
        uploadedLabel: "Live now",
      },
      {
        id: "v-tr-2",
        title: "Top 10 Hidden Gems (Indie picks)",
        thumbnailUrl: "/demo/thumbs/thumb-04.svg",
        durationLabel: "12:40",
        kind: "video",
        category: "Movies",
        creator: creators[0],
        viewsLabel: "420k views",
        uploadedLabel: "2 days ago",
      },
      {
        id: "v-tr-3",
        title: "Cricket World Cup: Highlights",
        thumbnailUrl: "/demo/thumbs/thumb-05.svg",
        durationLabel: "10:18",
        kind: "video",
        category: "Live",
        creator: creators[5],
        viewsLabel: "2.1M views",
        uploadedLabel: "1 week ago",
      },
      {
        id: "v-live-2",
        title: "Late Night Lo‑Fi: Chill Vibes HQ",
        thumbnailUrl: "/demo/thumbs/thumb-01.svg",
        kind: "live",
        category: "Music",
        creator: creators[2],
        viewsLabel: "850 watching",
        uploadedLabel: "Live now",
      },
    ],
    forYouFilters: ["All", "Gaming", "Music", "Movies"],
    forYou: [
      {
        id: "v-1",
        title: "How to build a SaaS in 30 days using Next.js",
        thumbnailUrl: "/demo/thumbs/thumb-04.svg",
        durationLabel: "12:48",
        kind: "video",
        category: "Movies",
        creator: creators[0],
        viewsLabel: "89k views",
        uploadedLabel: "2 days ago",
      },
      {
        id: "v-2",
        title: "React Conference 2024: Keynote and New Features",
        thumbnailUrl: "/demo/thumbs/thumb-02.svg",
        durationLabel: "10:18",
        kind: "live",
        category: "Live",
        creator: creators[1],
        viewsLabel: "1.2k watching",
        uploadedLabel: "Live now",
      },
      {
        id: "v-3",
        title: "Mastering Minimal UI Design: A Comprehensive Guide",
        thumbnailUrl: "/demo/thumbs/thumb-03.svg",
        durationLabel: "18:10",
        kind: "video",
        category: "Movies",
        creator: creators[2],
        viewsLabel: "210k views",
        uploadedLabel: "1 week ago",
      },
      {
        id: "v-4",
        title: "The Future of Space Travel: Mars Mission Update",
        thumbnailUrl: "/demo/thumbs/thumb-01.svg",
        durationLabel: "09:50",
        kind: "video",
        category: "Movies",
        creator: creators[3],
        viewsLabel: "1.5M views",
        uploadedLabel: "4 days ago",
      },
      {
        id: "v-5",
        title: "Street Food Tour: Kolkata Edition",
        thumbnailUrl: "/demo/thumbs/thumb-05.svg",
        durationLabel: "24:00",
        kind: "video",
        category: "Movies",
        creator: creators[4],
        viewsLabel: "670k views",
        uploadedLabel: "2 days ago",
      },
      {
        id: "v-6",
        title: "Valorant Pro League: Finals - Day 2",
        thumbnailUrl: "/demo/thumbs/thumb-06.svg",
        durationLabel: "02:40",
        kind: "live",
        category: "Gaming",
        creator: creators[5],
        viewsLabel: "45k watching",
        uploadedLabel: "Live now",
      },
    ],
    subscriptions: DEMO_SUBSCRIPTIONS,
  };
}

export function getDemoVideoDetails(id: string): VideoDetailsPayload {
  const feed = getDemoFeed();
  const fallback = feed.forYou[0];
  const video = feed.forYou.find((v) => v.id === id) ?? fallback;

  return {
    video: {
      ...video,
      description:
        "Welcome to the future. In this episode, we dive into cinematic lighting, high-contrast scenes, and the subtle art of making interfaces feel alive.",
      tags: ["Cyberpunk", "HDR", "VFX"],
      likesLabel: "45K",
    },
    chat: {
      viewersLabel: "28.4K viewers",
      messages: [
        {
          id: "m1",
          user: { name: "CyberSam", badge: "creator" },
          message: "The lighting in this scene is absolutely insane!",
        },
        {
          id: "m2",
          user: { name: "NeonKnight", badge: "mod" },
          message: "Please keep the chat respectful everyone!",
        },
        {
          id: "m3",
          user: { name: "RetroWave777" },
          message: "LOVE THE VIBES!",
        },
        {
          id: "m4",
          user: { name: "GoldGamer" },
          message: "Just donated 500! Keep it up!",
          highlighted: true,
        },
      ],
    },
  };
}

export function getDemoDashboard(): DashboardPayload {
  return {
    user: {
      name: "Alex Rivera",
      handle: "@rivera_creations",
      avatarUrl: "/demo/avatars/avatar-01.svg",
      planName: "StreamHub Pro",
    },
    stats: [
      {
        id: "views",
        label: "Total Video Views",
        value: "1.2M",
        deltaLabel: "+12.5% this week",
      },
      {
        id: "engagement",
        label: "Total Engagement",
        value: "85.4K",
        deltaLabel: "+4.2% this week",
      },
    ],
    recentHistory: [
      {
        id: "h1",
        title: "Mastering Cinematic Lighting in 2024",
        meta: "Visual Arts Mastery • 1.2M views • 2 days ago",
        thumbnailUrl: "/demo/thumbs/thumb-03.svg",
        progress: 0.88,
      },
      {
        id: "h2",
        title: "UI Design Trends that actually work",
        meta: "Design Lab • 450K views • 5 days ago",
        thumbnailUrl: "/demo/thumbs/thumb-04.svg",
        progress: 0.62,
      },
      {
        id: "h3",
        title: "Exploring Deep Space: New Horizon",
        meta: "SpaceX Unofficial • 3M views • 1 week ago",
        thumbnailUrl: "/demo/thumbs/thumb-01.svg",
        progress: 0.35,
      },
    ],
  };
}

