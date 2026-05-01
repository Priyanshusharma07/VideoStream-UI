import type { Video } from "@/src/types/video";

export const mockVideos: Video[] = [
  {
    id: "live-coding-nextjs",
    title: "LIVE: Building a Streaming UI in Next.js",
    description:
      "Join the live session where we build a streaming UI end-to-end, discuss architecture, and answer questions.",
    thumbnailUrl: "/demo/thumbs/thumb-01.svg",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    duration: "LIVE",
    views: 12_480,
    createdAt: "2026-04-08T14:00:00.000Z",
    channelName: "StreamHub Live",
    category: "Tech",
    isPremium: false,
  },
  {
    id: "live-music-chill",
    title: "LIVE: Chill Beats Radio (Demo Stream)",
    description:
      "A demo live stream for UI development. This plays an HLS sample stream using hls.js on supported browsers.",
    thumbnailUrl: "/demo/thumbs/thumb-02.svg",
    videoUrl: "https://test-streams.mux.dev/test_001/stream.m3u8",
    duration: "LIVE",
    views: 98_210,
    createdAt: "2026-04-08T16:30:00.000Z",
    channelName: "Chill Station Live",
    category: "Entertainment",
    isPremium: true,
  },
  {
    id: "edu-nextjs-app-router",
    title: "Next.js App Router Crash Course (2026 Edition)",
    description:
      "Learn the fundamentals of the Next.js App Router: routing, layouts, loading states, server components, and best practices for scalable apps.",
    thumbnailUrl: "/demo/thumbs/thumb-03.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "18:42",
    views: 128_540,
    createdAt: "2026-02-18T10:15:00.000Z",
    channelName: "Dev Classroom",
    category: "Education",
    isPremium: false,
  },
  {
    id: "tech-react-19-features",
    title: "React 19 Features You Should Know",
    description:
      "A fast walkthrough of practical React 19 updates and patterns for production apps, with examples and migration tips.",
    thumbnailUrl: "/demo/thumbs/thumb-04.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "12:09",
    views: 542_013,
    createdAt: "2026-01-29T08:30:00.000Z",
    channelName: "Frontend Weekly",
    category: "Tech",
    isPremium: false,
  },
  {
    id: "entertainment-lofi-night",
    title: "Late Night Lo-Fi Beats (1 Hour Mix)",
    description:
      "Relaxing lo-fi playlist for coding sessions. Grab your headphones and enjoy the vibe.",
    thumbnailUrl: "/demo/thumbs/thumb-05.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    duration: "1:00:00",
    views: 8_914_220,
    createdAt: "2025-12-05T20:00:00.000Z",
    channelName: "Chill Station",
    category: "Entertainment",
    isPremium: true,
  },
  {
    id: "edu-ts-patterns",
    title: "TypeScript Patterns: No Any, Real Safety",
    description:
      "Write clean TypeScript with strict mode: typed APIs, discriminated unions, and utility patterns that scale.",
    thumbnailUrl: "/demo/thumbs/thumb-06.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: "22:31",
    views: 274_905,
    createdAt: "2026-03-02T15:45:00.000Z",
    channelName: "TS Masters",
    category: "Education",
    isPremium: false,
  },
  {
    id: "tech-hls-streaming",
    title: "HLS Streaming Explained (Manifest, Segments, ABR)",
    description:
      "A practical explanation of how HLS works and how players pick quality levels using adaptive bitrate streaming.",
    thumbnailUrl: "/demo/thumbs/thumb-01.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    duration: "14:56",
    views: 91_204,
    createdAt: "2026-02-10T09:00:00.000Z",
    channelName: "Streaming Lab",
    category: "Tech",
    isPremium: false,
  },
  {
    id: "entertainment-movie-trailers",
    title: "Top Movie Trailers This Week",
    description:
      "A quick roundup of the most exciting new movie trailers, with timestamps and highlights.",
    thumbnailUrl: "/demo/thumbs/thumb-02.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "09:18",
    views: 1_203_771,
    createdAt: "2026-03-18T12:00:00.000Z",
    channelName: "CineScope",
    category: "Entertainment",
    isPremium: false,
  },
  {
    id: "edu-system-design-cdn",
    title: "System Design: Building a Video CDN (Beginner Friendly)",
    description:
      "From origin to edge: a high-level introduction to CDN concepts used in video streaming platforms.",
    thumbnailUrl: "/demo/thumbs/thumb-03.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    duration: "27:44",
    views: 63_890,
    createdAt: "2026-02-24T17:20:00.000Z",
    channelName: "Architecture Academy",
    category: "Education",
    isPremium: true,
  },
  {
    id: "tech-next-perf",
    title: "Next.js Performance Checklist (Real World)",
    description:
      "Speed up your Next.js app: caching, images, route splitting, bundle analysis, and common pitfalls.",
    thumbnailUrl: "/demo/thumbs/thumb-04.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: "16:05",
    views: 310_442,
    createdAt: "2026-03-11T06:10:00.000Z",
    channelName: "Next Level Dev",
    category: "Tech",
    isPremium: false,
  },
  {
    id: "entertainment-gaming-highlights",
    title: "Gaming Highlights: Best Moments Compilation",
    description:
      "A quick compilation of the best moments from recent matches, edited for maximum fun.",
    thumbnailUrl: "/demo/thumbs/thumb-05.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    duration: "11:47",
    views: 2_540_110,
    createdAt: "2026-01-08T19:00:00.000Z",
    channelName: "Clip Vault",
    category: "Entertainment",
    isPremium: false,
  },
  {
    id: "edu-ui-design",
    title: "UI Design Basics for Developers (Tailwind Edition)",
    description:
      "Spacing, typography, color, and layout: practical UI tips you can apply immediately using Tailwind CSS.",
    thumbnailUrl: "/demo/thumbs/thumb-06.svg",
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    duration: "19:22",
    views: 148_992,
    createdAt: "2026-03-26T11:25:00.000Z",
    channelName: "Design for Devs",
    category: "Education",
    isPremium: false,
  },
];

export const videoCategories = Array.from(
  new Set(mockVideos.map((v) => v.category)),
);
