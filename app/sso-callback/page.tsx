"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * SSO callback placeholder.
 * Social auth (Google, Facebook, Apple) is coming soon.
 * For now, redirect to login.
 */
export default function SSOCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            play_arrow
          </span>
        </div>
        <span className="text-2xl font-black tracking-tighter text-white">CINEVIEW</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
        <p className="text-white/40 text-sm font-medium">Redirecting…</p>
      </div>
    </div>
  );
}
