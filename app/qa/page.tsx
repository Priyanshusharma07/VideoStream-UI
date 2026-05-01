"use client";

import Link from "next/link";
import { appRoutes } from "@/src/config/appRoutes";
import { ClientChecks } from "@/app/qa/ui/ClientChecks";

export const dynamic = "force-dynamic";

type Group = {
  title: string;
  kind: (typeof appRoutes)[number]["kind"];
  description: string;
};

const groups: Group[] = [
  {
    title: "Pages",
    kind: "public",
    description: "Public pages you can open without login.",
  },
  {
    title: "Auth",
    kind: "auth",
    description: "Authentication-related pages and forms.",
  },
  {
    title: "App",
    kind: "app",
    description: "In-app pages (some behave like authenticated screens).",
  },
  {
    title: "Demo API",
    kind: "demo-api",
    description: "Next.js Route Handlers under /api (JSON responses).",
  },
];

export default function QaPage() {
  return (
    <div className="py-12 px-[5vw] max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-secondary">fact_check</span>
            QA Hub
          </h1>
          <p className="mt-2 text-white/50 font-medium">Verify system integrity and interface responsiveness.</p>
        </div>
        <div className="text-xs font-black text-white/20 uppercase tracking-[0.2em] hidden sm:block">
          Environment: Development
        </div>
      </header>

      {/* Main Section */}
      <div className="glass-panel p-10 rounded-[2.5rem]">
        <div className="flex flex-col gap-4 mb-12 pb-12 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">Checklist & Diagnostics</h2>
              <p className="text-sm text-white/40 font-medium leading-relaxed">
                Open every page and verify the key buttons work. Client-side checks
                run automatically below to catch obvious breakages in real-time.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-xs text-secondary">info</span>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Keep console open</span>
            </div>
          </div>

          <div className="mt-8">
            <ClientChecks />
          </div>
        </div>

        <div className="space-y-16">
          {groups.map((g) => {
            const routes = appRoutes.filter((r) => r.kind === g.kind);
            return (
              <section key={g.kind}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                      {g.title}
                    </div>
                    <div className="mt-1 text-sm text-white/40 font-medium italic">
                      {g.description}
                    </div>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{routes.length} ROUTES</span>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {routes.map((r) => (
                    <div
                      key={r.path}
                      className="rounded-[2rem] glass-card p-6 border border-white/5 hover:border-white/15 transition-all group"
                    >
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors">
                            {r.label}
                          </h4>
                          <div className="mt-1 truncate font-mono text-[10px] text-white/20">
                            {r.path}
                          </div>
                        </div>

                        {r.notes && (
                          <div className="text-[11px] text-white/40 font-medium mb-6 leading-relaxed">
                            {r.notes}
                          </div>
                        )}

                        <div className="mt-auto">
                          <Link
                            href={r.path}
                            className="w-full h-10 flex items-center justify-center rounded-xl bg-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                          >
                            Open Route
                          </Link>
                        </div>

                        {r.check && r.check.length > 0 && (
                          <ul className="mt-6 space-y-2 border-t border-white/5 pt-4">
                            {r.check.map((c) => (
                              <li key={c} className="flex items-center gap-3">
                                <span className="h-1 w-1 rounded-full bg-secondary" />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{c}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <footer className="mt-20 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white transition-all">
          <span className="material-symbols-outlined text-sm">keyboard_return</span>
          Return to CineGlas
        </Link>
      </footer>
    </div>
  );
}


