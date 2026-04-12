export type VideoCreator = {
  id: number | string;
  name: string;
  avatarUrl: string | null;
};

export type VideoDetail = {
  id: number | string;
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl: string | null;
  durationLabel?: string;
  kind: "video" | "live";
  category: string;
  creator: VideoCreator;
  viewsLabel: string;
  uploadedLabel: string;
  likesLabel: string;
  status: string;
};

export type ChatMessage = {
  id: string;
  user: { name: string; badge?: "mod" | "creator" };
  message: string;
  highlighted?: boolean;
};

export type WatchPagePayload = {
  video: VideoDetail;
  chat: { viewersLabel: string; messages: ChatMessage[] };
  playback: {
    hlsManifestPath?: string | null;
    signedUrl?: string | null;
    status: string;
    expiresIn?: number;
  };
};

export type VideoStatusPayload = {
  id: number | string;
  status: string;
  hlsReady: boolean;
  hlsManifestPath: string | null;
};
