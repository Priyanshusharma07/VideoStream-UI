"use client";

import { AppTopbar } from "@/components/app/AppTopbar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppBottomNav } from "@/components/app/AppBottomNav";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide common navigation on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Dynamic Background Blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-28 h-[40rem] w-[40rem] rounded-full bg-primary/10 blur-[120px] animate-blob" />
        <div className="absolute right-[-8rem] top-[-6rem] h-[45rem] w-[45rem] rounded-full bg-secondary/10 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute left-1/2 bottom-0 h-[35rem] w-[35rem] -translate-x-1/2 rounded-full bg-tertiary/10 blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <AppTopbar />
      <AppSidebar activePath={pathname} />
      <AppBottomNav activePath={pathname} />

      <main className="lg:ml-20 pt-24 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
