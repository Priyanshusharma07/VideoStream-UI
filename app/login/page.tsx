"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import {
  AppleIcon,
  EyeIcon,
  EyeOffIcon,
  FacebookIcon,
  GoogleIcon,
} from "@/components/icons";
import { login } from "@/lib/auth-client";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070A12] px-5 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute -right-24 -top-10 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/50" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8">
          <StreamHubLogo />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/35 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
            <p className="mt-1 text-sm text-white/55">
              Experience cinema in high definition
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
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
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email ? (
                <p id="email-error" className="mt-2 text-xs text-red-300/90">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-medium text-white/70">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-white/50 hover:text-white/70"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder:text-white/35 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-orange-500/70"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/55 hover:bg-white/5 hover:text-white/75"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="password-error" className="mt-2 text-xs text-red-300/90">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {success}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#FF6A00] text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,106,0,0.25)] transition hover:bg-[#ff7b1f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing In..." : "SIGN IN"}
            </button>

            <div className="pt-2">
              <div className="flex items-center gap-3 text-xs text-white/35">
                <span className="h-px flex-1 bg-white/10" />
                <span>OR CONTINUE WITH</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    toast.push({
                      variant: "info",
                      title: "Google sign-in",
                      message: "Coming soon (demo).",
                    })
                  }
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-white/5 text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                  aria-label="Continue with Google"
                >
                  <GoogleIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toast.push({
                      variant: "info",
                      title: "Apple sign-in",
                      message: "Coming soon (demo).",
                    })
                  }
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-white/5 text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                  aria-label="Continue with Apple"
                >
                  <AppleIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toast.push({
                      variant: "info",
                      title: "Facebook sign-in",
                      message: "Coming soon (demo).",
                    })
                  }
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-white/5 text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                  aria-label="Continue with Facebook"
                >
                  <FacebookIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-white/55">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-teal-300 hover:underline">
              SignUp
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          Demo login: <span className="text-white/50">demo@streamhub.com</span> /{" "}
          <span className="text-white/50">demo1234</span>
        </p>
      </div>
    </div>
  );
}
