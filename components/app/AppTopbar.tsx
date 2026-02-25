import Link from "next/link";
import { BellIcon } from "@/components/icons";
import { TopbarSearch } from "./TopbarSearch";

export function AppTopbar({
  placeholder,
  rightSlot,
}: {
  placeholder: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <TopbarSearch placeholder={placeholder} />

      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-black hover:bg-sky-400"
        >
          Go Live
        </Link>
        <Link
          href="/notifications"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5" />
        </Link>
        {rightSlot}
      </div>
    </div>
  );
}
