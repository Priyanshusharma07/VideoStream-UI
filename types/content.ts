export type Creator = {
  id: string;
  name: string;
  avatarUrl: string;
  isLive?: boolean;
};

export type VideoKind = "video" | "live";

export type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  durationLabel?: string;
  kind: VideoKind;
  category: string;
  creator: Creator;
  viewsLabel: string;
  uploadedLabel: string;
  isPremium?: boolean;
};

export type FeedPayload = {
  trendingTitle: string;
  trending: Video[];
  forYou: Video[];
  forYouFilters: string[];
  subscriptions: Creator[];
};

export type VideoDetailsPayload = {
  video: Video & {
    description: string;
    tags: string[];
    likesLabel: string;
    status: string;
  };
  chat: {
    viewersLabel: string;
    messages: Array<{
      id: string;
      user: { name: string; badge?: "mod" | "creator" };
      message: string;
      highlighted?: boolean;
    }>;
  };
  playback: {
    hlsManifestPath?: string | null;
    status: string;
  };
};

export type DashboardPayload = {
  user: {
    name: string;
    handle: string;
    avatarUrl: string;
    planName: string;
  };
  stats: {
    totalViews: string;
    totalLikes: string;
    totalVideos: number;
  };
  videos: Video[];
};
