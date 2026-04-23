"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; message: string; kind: ToastKind };

type ToastCtx = {
  notify: (message: string, kind?: ToastKind) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, kind: ToastKind = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const styles = {
    success: { bg: "bg-emerald-50", text: "text-emerald-900", ring: "ring-emerald-200", Icon: CheckCircle2, iconText: "text-emerald-600" },
    error: { bg: "bg-rose-50", text: "text-rose-900", ring: "ring-rose-200", Icon: XCircle, iconText: "text-rose-600" },
    info: { bg: "bg-sky-50", text: "text-sky-900", ring: "ring-sky-200", Icon: Info, iconText: "text-sky-600" },
  }[toast.kind];

  const Icon = styles.Icon;
  return (
    <div
      className={`pointer-events-auto ${styles.bg} ${styles.text} ring-1 ${styles.ring} shadow-[0_8px_24px_rgba(0,0,0,0.12)] rounded-xl px-4 py-3 flex items-center gap-3 min-w-[260px] max-w-sm transition-all duration-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <Icon size={18} className={styles.iconText} />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X size={14} />
      </button>
    </div>
  );
}
