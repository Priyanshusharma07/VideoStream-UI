"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastVariant = "info" | "success" | "error";

type Toast = {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
  createdAt: number;
};

type ToastInput = Omit<Toast, "id" | "createdAt"> & { durationMs?: number };

type ToastContextValue = {
  push: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function toastStyles(variant: ToastVariant) {
  if (variant === "success") return "border-emerald-500/20 bg-emerald-500/10";
  if (variant === "error") return "border-red-500/20 bg-red-500/10";
  return "border-white/10 bg-white/5";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, number>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timeoutsRef.current.get(id);
    if (handle) window.clearTimeout(handle);
    timeoutsRef.current.delete(id);
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();
      const toast: Toast = {
        id,
        title: input.title,
        message: input.message,
        variant: input.variant,
        createdAt: Date.now(),
      };

      setToasts((prev) => [toast, ...prev].slice(0, 4));

      const durationMs = input.durationMs ?? 2600;
      const handle = window.setTimeout(() => remove(id), durationMs);
      timeoutsRef.current.set(id, handle);
    },
    [remove],
  );

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      for (const handle of timeouts.values()) {
        window.clearTimeout(handle);
      }
      timeouts.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 w-[320px] max-w-[calc(100vw-40px)] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "rounded-2xl border px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur",
              toastStyles(t.variant),
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white/90">
                  {t.title}
                </div>
                {t.message ? (
                  <div className="mt-1 text-sm text-white/65">{t.message}</div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="shrink-0 rounded-lg bg-white/5 px-2 py-1 text-xs text-white/60 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                aria-label="Dismiss notification"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
