"use client";

import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    current: false,
    features: ["720p streaming", "5 GB storage", "Ad-supported", "Community support"],
    color: "white",
  },
  {
    id: "pro",
    name: "CineGlas Pro",
    price: "$9",
    period: "/ mo",
    current: true,
    features: [
      "4K + HDR streaming",
      "100 GB storage",
      "No ads",
      "Priority support",
      "Custom channel branding",
    ],
    color: "primary",
    badge: "Current Plan",
  },
  {
    id: "creator",
    name: "Creator Studio",
    price: "$29",
    period: "/ mo",
    current: false,
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "Analytics dashboard",
      "Monetisation tools",
      "API access",
    ],
    color: "secondary",
    badge: "Best Value",
  },
];

const INVOICES = [
  { id: "INV-2602", date: "Feb 12, 2026", amount: "$9.00", status: "Paid" },
  { id: "INV-2601", date: "Jan 12, 2026", amount: "$9.00", status: "Paid" },
  { id: "INV-2512", date: "Dec 12, 2025", amount: "$9.00", status: "Paid" },
];

export default function BillingPage() {
  const toast = useToast();

  const handleAction = (action: string) => {
    toast.push({
      variant: "info",
      title: "Billing Action",
      message: `${action} is coming soon!`,
    });
  };

  return (
    <div className="py-12 px-[5vw] max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary">payments</span>
            Billing
          </h1>
          <p className="mt-2 text-white/50 font-medium">Manage your cinematic subscription and invoices.</p>
        </div>
      </header>

      {/* Plans Section */}
      <section className="mb-20">
        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">
          Available Plans
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[2.5rem] p-10 flex flex-col glass-panel transition-all hover:border-white/20 ${
                plan.current ? "border-primary/40 bg-primary/5 ring-4 ring-primary/5" : "border-white/5"
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  plan.current ? "bg-primary text-black shadow-lg shadow-primary/20" : "bg-secondary text-black"
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-black text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white tracking-tighter">{plan.price}</span>
                  <span className="text-white/30 font-bold text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-xs font-medium text-white/60 leading-tight">
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !plan.current && handleAction(`Switching to ${plan.name}`)}
                disabled={plan.current}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                  plan.current
                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                    : "bg-white text-black hover:bg-primary shadow-lg shadow-white/5"
                }`}
              >
                {plan.current ? "ACTIVE NOW" : "UPGRADE"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Method & History */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Payment Method */}
        <section>
          <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">
            Payment Method
          </div>
          <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black italic shadow-lg">
                VISA
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-white tracking-tight">Visa ending in 4242</div>
                <div className="text-xs text-white/30 font-black uppercase tracking-widest mt-1">EXPIRES 08 / 27</div>
              </div>
              <button 
                onClick={() => handleAction("Updating card")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Next Bill</div>
                <div className="text-sm font-bold text-white">Mar 12, 2026</div>
              </div>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Amount</div>
                <div className="text-sm font-bold text-primary">$9.00</div>
              </div>
            </div>

            <button
              onClick={() => handleAction("Cancellation request")}
              className="w-full py-4 text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all"
            >
              Cancel Subscription
            </button>
          </div>
        </section>

        {/* Invoice History */}
        <section>
          <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">
            Invoice History
          </div>
          <div className="glass-panel rounded-[2.5rem] overflow-hidden">
            <div className="divide-y divide-white/5">
              {INVOICES.map((inv) => (
                <div key={inv.id} className="p-6 flex items-center justify-between hover:bg-white/2 transition-colors">
                  <div>
                    <div className="text-sm font-bold text-white">{inv.id}</div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">{inv.date}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-black text-white">{inv.amount}</div>
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">{inv.status}</div>
                    </div>
                    <button 
                      onClick={() => handleAction(`Downloading ${inv.id}`)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-primary hover:text-black transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-20 flex justify-center">
        <Link
          href="/dashboard"
          className="px-12 h-14 flex items-center justify-center rounded-2xl bg-white text-black font-black hover:brightness-90 transition-all shadow-lg shadow-white/5"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

