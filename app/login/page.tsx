"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth-client";
import { saveAuthSession } from "@/lib/auth-session";

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

/* ─── Social Button (Coming Soon) ────────────────────────────────────────── */
function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      disabled
      title="Coming soon"
      className="relative flex items-center justify-center gap-3 w-full h-12 bg-white/5 border border-white/10 rounded-2xl text-white/40 font-semibold text-sm cursor-not-allowed select-none overflow-hidden group transition-all"
    >
      {icon}
      <span>Continue with {label}</span>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest bg-white/10 text-white/40 px-2 py-0.5 rounded-full">
        Soon
      </span>
    </button>
  );
}

/* ─── Main Login Page ─────────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await login({ email: email.trim(), password });
      if (!result.ok) {
        setError(result.error?.message ?? "Invalid credentials.");
        return;
      }
      const token = result.data.accessToken ?? result.data.access_token;
      if (token) {
        saveAuthSession({ accessToken: token });
      }
      router.push("/feed");
    });
  }

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
          <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </div>
            CINEVIEW
          </Link>
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
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2.5 justify-center">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </div>
            CINEVIEW
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight mb-1.5">Welcome back</h1>
            <p className="text-white/40 text-sm font-medium">Sign in to continue your cinematic journey.</p>
          </div>

          {/* Social Buttons — Coming Soon */}
          <div className="space-y-3 mb-6">
            <SocialButton
              label="Google"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
            />
            <SocialButton
              label="Facebook"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              }
            />
            <SocialButton
              label="Apple"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                </svg>
              }
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoComplete="email"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm placeholder:text-white/20 outline-none focus:border-primary/60 focus:bg-primary/5 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 pr-12 text-white text-sm placeholder:text-white/20 outline-none focus:border-primary/60 focus:bg-primary/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-[11px] text-primary font-bold hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 text-center">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-primary-container hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50"
            >
              {isPending ? "Signing in…" : "Sign In"}
            </button>

            <p className="text-center text-xs text-white/30 pt-1">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Create one
              </Link>
            </p>
          </form>

          {/* Bottom terms */}
          <p className="mt-8 text-center text-[10px] text-white/20 leading-relaxed">
            By continuing, you agree to CINEVIEW&apos;s{" "}
            <Link href="#" className="hover:text-white/50 underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="#" className="hover:text-white/50 underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
