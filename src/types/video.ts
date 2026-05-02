export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  views: number;
  createdAt: string;
  channelName: string;
  category: string;
  isPremium: boolean;
  creator?: {
    name: string;
  };
}
