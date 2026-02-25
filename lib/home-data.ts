export type HomeCategory = {
  id: string;
  label: string;
  image: {
    from: string;
    to: string;
  };
};

export const HOME_CATEGORIES: HomeCategory[] = [
  { id: "sci-fi", label: "SCI-FI", image: { from: "#0ea5e9", to: "#4f46e5" } },
  { id: "action", label: "ACTION", image: { from: "#f97316", to: "#ef4444" } },
  { id: "cyberpunk", label: "CYBERPUNK", image: { from: "#22c55e", to: "#06b6d4" } },
  { id: "anime", label: "ANIME", image: { from: "#a855f7", to: "#3b82f6" } },
  { id: "thriller", label: "THRILLER", image: { from: "#f59e0b", to: "#a3e635" } },
  { id: "fantasy", label: "FANTASY", image: { from: "#10b981", to: "#60a5fa" } },
];

