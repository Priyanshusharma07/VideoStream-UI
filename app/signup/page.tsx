"use client";

import Link from "next/link";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LockIcon, MailIcon, UserIcon } from "@/components/icons";
import { signup } from "@/services/auth-client";
import { useToast } from "@/components/ui/ToastProvider";

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
  const [success, setSuccess] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      console.log("Signup result:", result);

      if (!result.ok) {
        setError(result.error?.message ?? "Signup failed.");
        return;
      }

      setSuccess("Account created. You can now login.");
      toast.push({ variant: "success", title: "Account created", message: "Please login." });
      router.push("/login");
    });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070A12] px-5 py-12 text-white">

      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,200,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(140,0,255,0.15),transparent_40%)]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <StreamHubLogo />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl shadow-2xl">

          {/* Heading */}
          <h1 className="text-center text-3xl font-bold tracking-widest">
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              JOIN THE FUTURE
            </span>
          </h1>

          <p className="mt-2 text-center text-sm text-white/50">
            Create your creator account today
          </p>

          {/* Form */}
          <form className="mt-8 space-y-5" onSubmit={onSubmit}>

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-xs text-white/60">
                FULL NAME
              </label>
              <div className="flex items-center rounded-lg bg-white/5 px-3 ring-1 ring-white/10 focus-within:ring-orange-500/60">
                <UserIcon className="mr-2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs text-white/60">
                EMAIL ADDRESS
              </label>
              <div className="flex items-center rounded-lg bg-white/5 px-3 ring-1 ring-white/10 focus-within:ring-orange-500/60">
                <MailIcon className="mr-2 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs text-white/60">
                PASSWORD
              </label>
              <div className="flex items-center rounded-lg bg-white/5 px-3 ring-1 ring-white/10 focus-within:ring-orange-500/60">
                <LockIcon className="mr-2 h-4 w-4 text-white/40" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/40"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {success}{" "}
                <Link href="/login" className="text-orange-400 hover:underline">
                  Login
                </Link>
              </div>
            ) : null}

            {/* Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6A00] text-sm font-semibold text-white transition hover:bg-[#ff7b1f] disabled:opacity-60"
            >
              {isPending ? "Creating..." : "CREATE ACCOUNT →"}
            </button>

            {/* Divider */}
            <div className="relative my-6 text-center text-xs text-white/40">
              <span className="relative z-10 bg-black/40 px-3">
                OR SIGN UP WITH
              </span>
              <div className="absolute inset-0 top-1/2 h-px bg-white/10" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() =>
                  toast.push({
                    variant: "info",
                    title: "Google sign-up",
                    message: "Coming soon (demo).",
                  })
                }
                className="flex h-11 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm transition hover:bg-white/10"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() =>
                  toast.push({
                    variant: "info",
                    title: "Discord sign-up",
                    message: "Coming soon (demo).",
                  })
                }
                className="flex h-11 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm transition hover:bg-white/10"
              >
                Discord
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-white/50">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-400 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
