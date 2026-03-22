"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { MailIcon } from "@/components/icons";
import { forgotPassword } from "@/lib/auth-client";

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
      setMessage("If that email exists, we sent a reset link.");
    });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070A12] px-5 py-12 text-white">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,200,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(140,0,255,0.15),transparent_40%)]" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <StreamHubLogo />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl shadow-2xl">

          <h1 className="text-center text-3xl font-bold tracking-widest">
            RESET PASSWORD
          </h1>

          <p className="mt-2 text-center text-sm text-white/50">
            Enter the email associated with your account and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block text-xs text-white/60">
                EMAIL ADDRESS
              </label>

              <div className="flex items-center rounded-lg bg-white/5 px-3 ring-1 ring-white/10 focus-within:ring-orange-500/60">
                <MailIcon className="mr-2 h-4 w-4 text-white/40" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="e.g., alex@example.com"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/40"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6A00] text-sm font-semibold text-white transition hover:bg-[#ff7b1f] disabled:opacity-60"
            >
              {isPending ? "Sending..." : "Send Reset Link →"}
            </button>

            <p className="text-center text-sm text-white/50">
              <Link href="/login" className="text-orange-400 hover:underline">
                ← Back to Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
