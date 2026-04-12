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
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-sm font-extrabold tracking-[0.22em] text-white/90"
        >
          STREAMHUB
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white/60">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <Link href="/feed" className="hover:text-white">
            Feed
          </Link>
          <Link href="/live" className="hover:text-white">
            Live
          </Link>
          <Link href="/qa" className="text-white/90">
            QA
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-14">
        <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                QA Checklist
              </h1>
              <p className="mt-1 text-sm text-white/55">
                Open every page and verify the key buttons work. Client checks
                run below to catch obvious breakages.
              </p>
            </div>
            <div className="text-xs text-white/45">
              Tip: keep DevTools console open.
            </div>
          </div>

          <div className="mt-6">
            <ClientChecks />
          </div>

          <div className="mt-8 space-y-8">
            {groups.map((g) => {
              const routes = appRoutes.filter((r) => r.kind === g.kind);
              return (
                <section key={g.kind}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold tracking-[0.22em] text-white/35">
                        {g.title.toUpperCase()}
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {g.description}
                      </div>
                    </div>
                    <div className="text-xs text-white/35">
                      {routes.length} routes
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {routes.map((r) => (
                      <div
                        key={r.path}
                        className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-white/90">
                              {r.label}
                            </div>
                            <div className="mt-1 truncate font-mono text-xs text-white/45">
                              {r.path}
                            </div>
                            {r.notes ? (
                              <div className="mt-2 text-xs text-white/55">
                                {r.notes}
                              </div>
                            ) : null}
                          </div>
                          <Link
                            href={r.path}
                            className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
                          >
                            Open
                          </Link>
                        </div>

                        {r.check && r.check.length > 0 ? (
                          <ul className="mt-3 space-y-1 text-xs text-white/55">
                            {r.check.map((c) => (
                              <li key={c} className="flex gap-2">
                                <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/80" />
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

