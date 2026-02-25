"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { StreamHubLogo } from "@/components/StreamHubLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setMessage("If that email exists, we sent a reset link.");
    });
  }

  return (
    <div className="min-h-screen bg-[#070A12] px-5 py-12 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <StreamHubLogo />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/35 p-7 backdrop-blur">
          <h1 className="text-xl font-semibold">Reset your password</h1>
          <p className="mt-1 text-sm text-white/55">
            Enter your email and we&apos;ll send instructions.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-xs font-medium text-white/70">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-orange-500/70"
              />
            </div>

            {message ? (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#FF6A00] text-sm font-semibold text-white transition hover:bg-[#ff7b1f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Sending..." : "Send reset link"}
            </button>

            <p className="text-center text-sm text-white/55">
              <Link href="/login" className="text-teal-300 hover:underline">
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

