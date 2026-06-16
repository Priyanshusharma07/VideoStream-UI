import { SignUp } from "@clerk/nextjs";

function FilmGrain() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none z-10" aria-hidden="true">
      <filter id="grain-signup">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-signup)" />
    </svg>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#080a0f] flex overflow-hidden">
      <FilmGrain />

      {/* ── LEFT: Visual Panel ───────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-end p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf2xaEUL1URDpOH84lNh1Ky_bLz8GXnX9rIw-rhu6afxRfNs3V---ItIUZ1in8eiO-HEqhGMqb6TYTW_tlvsfD3piJ17ZiZgI6D45MkZZ-xiqySvuuH_io33QtTy1Vo8rbn6cU4117ea71hr86GVDAhMrETqejGVYk44ThecNhpjKkZVMKs_i396i1Axvfz3nFBZSvWx8EdFPnwJsu37f23aykP2HfRMfdtq9Kemfgb8b8UBDAxVOHzVUWUcfnfC_LdGokpQkXb8Z-"
            alt="CINEVIEW streaming"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a0f]/5 via-transparent to-[#080a0f]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/30 to-transparent" />
        </div>

        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="absolute top-10 left-10 z-20">
          <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </div>
            CINEVIEW
          </div>
        </div>

        <div className="relative z-20">
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6 max-w-md">
            Join the future<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-pink-300">
              of streaming.
            </span>
          </h2>
          <div className="space-y-4">
            {[
              { icon: "play_circle", label: "Unlimited Ultra HD content" },
              { icon: "sensors", label: "Live events & exclusive premieres" },
              { icon: "workspace_premium", label: "Original series & creator exclusives" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
                </div>
                <span className="text-white/70 text-sm font-medium">{label}</span>
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
          <SignUp 
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
            path="/signup"
            fallbackRedirectUrl="/feed"
          />
        </div>
      </div>
    </div>
  );
}
