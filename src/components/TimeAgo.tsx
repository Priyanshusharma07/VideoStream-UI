import { timeAgo } from "@/lib/format";

export function TimeAgo({ date }: { date: string }) {
  return <span suppressHydrationWarning>{timeAgo(date)}</span>;
}
