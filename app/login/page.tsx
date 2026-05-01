"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CineViewLogo } from "@/components/StreamHubLogo";
import {
  AppleIcon,
  EyeIcon,
  EyeOffIcon,
  FacebookIcon,
  GoogleIcon,
} from "@/components/icons";
import { login } from "@/services/auth-client";
import { useToast } from "@/components/ui/ToastProvider";
import { saveAuthSession } from "@/lib/auth-session";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fieldErrors = useMemo(() => {
    const errors: { email?: string; password?: string } = {};
    if (email.length > 0 && !isEmail(email)) errors.email = "Enter a valid email.";
    if (password.length > 0 && password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    return errors;
  }, [email, password]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();
    if (!isEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Please enter your password.");
      return;
    }

    startTransition(async () => {
      const result = await login({ email: trimmedEmail, password });
      if (!result.ok) {
        setError(result.error?.message ?? "Login failed.");
        return;
      }
      saveAuthSession({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
        expiresAt: result.data.expiresAt,
      });

      setSuccess(`Signed in as ${result.data.user.email}.`);
      toast.push({ variant: "success", title: "Signed in", message: "Welcome back!" });
      router.push("/feed");
    });
  }

  return (
    <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/demo/thumbs/thumb-01.svg"
          alt="Background"
          fill
          className="object-cover opacity-20 grayscale-[0.5]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-transparent to-[#080a0f]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      </div>

      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-[5vw] py-8">
        <CineViewLogo />
      </header>

      <main className="relative z-10 w-full max-w-md px-6">
        <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl border-white/5">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-sm text-white/40 font-medium">The stories you love are waiting.</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
                Account Email
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">mail</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@cineview.com"
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white text-sm font-medium outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
                  Password
                </label>
                <Link href="/forgot-password" title="Recover Password" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">lock</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-12 text-white text-sm font-medium outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-[11px] font-black text-red-400 uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-white text-black font-black text-sm rounded-2xl hover:brightness-90 transition-all disabled:opacity-50 shadow-lg shadow-white/5"
            >
              {isPending ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5"></div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">OR</span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={() => toast.push({ variant: "info", title: "Coming soon" })}
              className="h-14 rounded-2xl glass-panel border-white/5 flex items-center justify-center hover:bg-white/5 transition-all group"
            >
              <GoogleIcon className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => toast.push({ variant: "info", title: "Coming soon" })}
              className="h-14 rounded-2xl glass-panel border-white/5 flex items-center justify-center hover:bg-white/5 transition-all group"
            >
              <AppleIcon className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          
          <p className="mt-8 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.1em]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Create one here
            </Link>
          </p>
          
          <div className="mt-10 p-4 rounded-2xl border border-white/5 bg-white/2 text-center">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
              Demo Access
            </p>
            <p className="mt-1 text-[11px] font-bold text-white/60">
              demo@cineview.com / demo1234
            </p>
          </div>
        </div>

        <footer className="mt-12 text-center max-w-[280px] mx-auto">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-relaxed">
            By continuing, you agree to CINEVIEW's 
            <Link className="text-white/40 hover:text-primary mx-1" href="#">Terms</Link> & 
            <Link className="text-white/40 hover:text-primary mx-1" href="#">Privacy</Link>.
          </p>
        </footer>
      </main>

      <div className="hidden lg:flex fixed bottom-8 left-8 items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">IMAX® ENHANCED EXPERIENCE</span>
      </div>
    </div>
  );
}

import Image from "next/image";

