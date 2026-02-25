import Link from "next/link";
import { StreamHubLogo } from "../StreamHubLogo";

export function HomeHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
      <Link href="/" className="flex items-center gap-3">
        <StreamHubLogo />
      </Link>

      <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
        <Link href="/explore" className="hover:text-white">
          Movies
        </Link>
        <Link href="/explore" className="hover:text-white">
          TV Shows
        </Link>
        <Link href="/explore" className="hover:text-white">
          Live
        </Link>
        <Link href="/login" className="hover:text-white">
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90"
        >
          Sign Up Free
        </Link>
      </nav>

      <div className="flex items-center gap-3 md:hidden">
        <Link
          href="/login"
          className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/10"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-black"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}

