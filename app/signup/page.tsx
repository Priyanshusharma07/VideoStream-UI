"use client";

import Link from "next/link";
import { CineViewLogo } from "@/components/StreamHubLogo";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LockIcon, MailIcon, UserIcon, AppleIcon, GoogleIcon, FacebookIcon } from "@/components/icons";
import { signup } from "@/services/auth-client";
import { saveAuthSession } from "@/lib/auth-session";
import { useToast } from "@/components/ui/ToastProvider";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (!result.ok) {
        setError(result.error?.message ?? "Signup failed.");
        return;
      }

      saveAuthSession({ accessToken: result.data.accessToken });
      toast.push({ variant: "success", title: "Welcome!", message: "Account created." });
      router.push("/feed");
    });
  }

  return (
    <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/demo/thumbs/thumb-02.svg"
          alt="Background"
          fill
          className="object-cover opacity-20 grayscale-[0.5]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-transparent to-[#080a0f]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -ml-48 -mb-48" />
      </div>

      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-[5vw] py-8">
        <CineViewLogo />
      </header>

      <main className="relative z-10 w-full max-w-md px-6">
        <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl border-white/5">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Join the Future</h1>
            <p className="text-sm text-white/40 font-medium">Create your creator account today</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
                Full Name
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">person</span>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white text-sm font-medium outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
                Account Email
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">mail</span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white text-sm font-medium outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
                Security Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">lock</span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white text-sm font-medium outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                />
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
              {isPending ? "CREATING..." : "CREATE ACCOUNT"}
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
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>

        <footer className="mt-12 text-center max-w-[280px] mx-auto">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-relaxed">
            By continuing, you agree to CINEVIEW's 
            <Link className="text-white/40 hover:text-primary mx-1" href="#">Terms</Link> & 
            <Link className="text-white/40 hover:text-primary mx-1" href="#">Privacy</Link>.
          </p>
        </footer>
      </main>

      <div className="hidden lg:flex fixed bottom-8 right-8 items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">IMAX® ENHANCED EXPERIENCE</span>
      </div>
    </div>
  );
}

