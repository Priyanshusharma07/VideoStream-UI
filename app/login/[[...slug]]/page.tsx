import { SignIn } from "@clerk/nextjs";

/* ─── Film Grain Texture ──────────────────────────────────────────────────── */
function FilmGrain() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none z-10"
      aria-hidden="true"
    >
      <filter id="grain-login">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-login)" />
    </svg>
  );
}

/* ─── Main Login Page ─────────────────────────────────────────────────────── */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#080a0f] flex overflow-hidden">
      <FilmGrain />

      {/* ── LEFT: Cinematic Poster Panel ─────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-end p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBImcS2ra2sZ_z9H_4F3sIz9YUbAMkeWq8uNn9hGnCEA0Qvsr0eV6DKiqsLLZv69SSM3BkphZq0dVxrYbjJr0c3YCiDla8adCYi_EkcqsOZnMDXWv56z3tsCKy0uexvXwLJr9TJxKtzDe7MoqnkTgQN23fAO9bydJd_FHTYVK3eBPAkY1MFh5rR-D22G2GwF1RZmsRvxpI_zWPL631yK3Q5eEKl6lslwzRSIKNN1qC6NAj-zYoN55e1p3JJhIWHJwJZc00GIU-oSXVN"
            alt="CINEVIEW — Neon Dreams"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f]/5 via-transparent to-[#080a0f]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/30 to-transparent" />
        </div>

        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="absolute top-10 left-10 z-20">
          <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </div>
            CINEVIEW
          </div>
        </div>

        <div className="relative z-20">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#FF0055] animate-pulse" />
            <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">Now Streaming</span>
          </div>
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-4 max-w-md">
            Your stories.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">
              Wherever you are.
            </span>
          </h2>
          <p className="text-white/50 text-base font-medium max-w-sm leading-relaxed">
            Join millions watching cinematic masterpieces, live events, and original series in stunning Ultra HD.
          </p>
          <div className="mt-8 flex gap-8">
            {[{ num: "4K+", label: "Ultra HD Titles" }, { num: "12M+", label: "Active Viewers" }, { num: "50+", label: "Categories" }].map(({ num, label }) => (
              <div key={label}>
                <div className="text-2xl font-black text-white">{num}</div>
                <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Auth Card ──────────────────────────────────────────── */}
      <div className="w-full lg:w-[520px] flex flex-col items-center justify-center relative bg-[#080a0f] px-6 py-12 overflow-y-auto">
        <div className="lg:hidden mb-10">
          <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2.5 justify-center">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </div>
            CINEVIEW
          </div>
        </div>

        <div className="w-full max-w-md flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white/5 border border-white/10 shadow-xl w-full",
                headerTitle: "text-white font-black",
                headerSubtitle: "text-white/40",
                formButtonPrimary: "bg-primary-container hover:bg-blue-600 text-white font-bold",
                formFieldLabel: "text-white/40 uppercase tracking-[0.15em] text-[11px] font-bold",
                formFieldInput: "bg-white/5 border-white/10 text-white focus:bg-primary/5 focus:border-primary/60",
                dividerLine: "bg-white/10",
                dividerText: "text-white/20",
                socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                footerActionText: "text-white/40",
                footerActionLink: "text-primary hover:text-blue-400",
              }
            }} 
            routing="path"
            path="/login"
            fallbackRedirectUrl="/feed"
          />
        </div>
      </div>
    </div>
  );
}

