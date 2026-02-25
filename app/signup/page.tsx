import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070A12] px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/35 p-7 text-center backdrop-blur">
        <h1 className="text-xl font-semibold">Sign up</h1>
        <p className="mt-2 text-sm text-white/55">
          UI coming next. For now, use the demo login page.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#FF6A00] text-sm font-semibold text-white transition hover:bg-[#ff7b1f]"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

