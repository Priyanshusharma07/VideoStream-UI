"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CineViewLogo } from "@/components/StreamHubLogo";
import { MailIcon } from "@/components/icons";
import { forgotPassword } from "@/services/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await forgotPassword({ email: email.trim() });
      if (!result.ok) {
        setError(result.error?.message ?? "Request failed.");
        return;
      }
      setMessage("Check your inbox. If the account exists, a link is on its way.");
    });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute inset-0 -z-10 bg-[#080a0f]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="mb-12 flex justify-center transform hover:scale-105 transition-transform duration-500">
          <CineViewLogo />
        </div>

        {/* Card */}
        <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Lost access?
            </h1>
            <p className="text-sm text-white/40 font-medium">
              No worries. Enter your email and we'll help you return to the big screen.
            </p>
          </header>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">
                Account Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                  <MailIcon className="h-5 w-5" />
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-white text-sm font-medium outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-[11px] font-black text-red-400 uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            {message && (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-[11px] font-black text-primary uppercase tracking-widest text-center">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-white text-black font-black text-sm rounded-2xl hover:brightness-90 transition-all disabled:opacity-50 shadow-lg shadow-white/5"
            >
              {isPending ? "SENDING..." : "RECOVER ACCOUNT"}
            </button>

            <div className="pt-4 text-center">
              <Link 
                href="/login" 
                className="text-[10px] font-black text-white/30 hover:text-primary uppercase tracking-[0.2em] transition-all"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

