import Link from "next/link";
import { StreamHubLogo } from "@/components/StreamHubLogo";
import { CheckCircleIcon, CreditCardIcon, StarIcon } from "@/components/icons";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    current: false,
    features: ["720p streaming", "5 GB storage", "Ad-supported", "Community support"],
    gradient: "from-white/5 to-white/3",
    badge: null,
  },
  {
    id: "pro",
    name: "StreamHub Pro",
    price: "$9",
    period: "/ month",
    current: true,
    features: [
      "4K + HDR streaming",
      "100 GB storage",
      "No ads",
      "Priority support",
      "Custom channel branding",
    ],
    gradient: "from-sky-500/20 via-indigo-500/10 to-purple-500/10",
    badge: "Current Plan",
  },
  {
    id: "creator",
    name: "Creator Studio",
    price: "$29",
    period: "/ month",
    current: false,
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "Analytics dashboard",
      "Monetisation tools",
      "API access",
      "Dedicated account manager",
    ],
    gradient: "from-purple-500/20 via-pink-500/10 to-orange-500/10",
    badge: "Best Value",
  },
];

const INVOICES = [
  { id: "INV-2602", date: "Feb 12, 2026", amount: "$9.00", status: "Paid" },
  { id: "INV-2601", date: "Jan 12, 2026", amount: "$9.00", status: "Paid" },
  { id: "INV-2512", date: "Dec 12, 2025", amount: "$9.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#070A12] px-6 py-10 text-white">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <StreamHubLogo />
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white">
            ← Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-semibold">Billing &amp; Subscription</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage your plan, payment method, and billing history.
        </p>

        {/* Plans */}
        <section className="mt-8">
          <div className="text-xs font-semibold tracking-[0.22em] text-white/35 mb-4">
            PLANS
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={[
                  "relative rounded-3xl p-6 ring-1 transition",
                  plan.current
                    ? "bg-gradient-to-br " + plan.gradient + " ring-sky-500/30"
                    : "bg-gradient-to-br " + plan.gradient + " ring-white/10",
                ].join(" ")}
              >
                {plan.badge && (
                  <span className={[
                    "absolute -top-3 left-5 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-[0.18em]",
                    plan.current
                      ? "bg-sky-500 text-black"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
                  ].join(" ")}>
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-start gap-2">
                  <StarIcon className={[
                    "mt-0.5 h-4 w-4 shrink-0",
                    plan.id === "creator" ? "text-purple-400" : plan.current ? "text-sky-400" : "text-white/30"
                  ].join(" ")} />
                  <div>
                    <div className="text-sm font-semibold text-white/90">{plan.name}</div>
                    <div className="mt-1">
                      <span className="text-2xl font-extrabold">{plan.price}</span>
                      <span className="text-xs text-white/45"> {plan.period}</span>
                    </div>
                  </div>
                </div>

                <ul className="mt-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/70">
                      <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={plan.current}
                  className={[
                    "mt-6 inline-flex h-10 w-full items-center justify-center rounded-xl text-xs font-semibold transition",
                    plan.current
                      ? "bg-white/10 text-white/50 cursor-default ring-1 ring-white/10"
                      : "bg-sky-500 text-black hover:bg-sky-400",
                  ].join(" ")}
                >
                  {plan.current ? "Current Plan" : `Switch to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Payment method */}
        <section className="mt-8">
          <div className="text-xs font-semibold tracking-[0.22em] text-white/35 mb-4">
            PAYMENT METHOD
          </div>
          <div className="rounded-3xl bg-black/35 p-6 ring-1 ring-white/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 ring-1 ring-white/10">
                  <CreditCardIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">Visa ending in 4242</div>
                  <div className="mt-0.5 text-xs text-white/45">Expires 08 / 27</div>
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10"
              >
                Update
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Next billing date</span>
                <span className="font-semibold text-white/90">March 12, 2026</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-white/60">Amount due</span>
                <span className="font-semibold text-sky-300">$9.00</span>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-red-500/10 py-2.5 text-xs font-semibold text-red-300 ring-1 ring-red-500/20 hover:bg-red-500/15"
            >
              Cancel Subscription
            </button>
          </div>
        </section>

        {/* Invoice history */}
        <section className="mt-8">
          <div className="text-xs font-semibold tracking-[0.22em] text-white/35 mb-4">
            INVOICE HISTORY
          </div>
          <div className="rounded-3xl bg-black/35 ring-1 ring-white/10 backdrop-blur overflow-hidden">
            {INVOICES.map((inv, i) => (
              <div
                key={inv.id}
                className={[
                  "flex items-center justify-between px-6 py-4",
                  i !== 0 ? "border-t border-white/8" : "",
                ].join(" ")}
              >
                <div>
                  <div className="text-sm font-medium text-white/85">{inv.id}</div>
                  <div className="mt-0.5 text-xs text-white/40">{inv.date}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-white/90">{inv.amount}</span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-400 ring-1 ring-emerald-400/20">
                    {inv.status}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-cyan-300 hover:underline"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-black hover:bg-white/90"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
