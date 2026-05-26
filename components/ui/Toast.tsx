"use client";

import { useEffect, useState } from "react";

let toastId = 0;
const listeners: Set<(t: ToastMsg | null) => void> = new Set();

export interface ToastMsg {
  id: number;
  message: string;
  type: "success" | "error";
}

export function showToast(message: string, type: "success" | "error" = "success") {
  const t: ToastMsg = { id: ++toastId, message, type };
  listeners.forEach((fn) => fn(t));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => {
    const fn = (t: ToastMsg | null) => {
      if (t) {
        setToasts((prev) => [...prev, t]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((x) => x.id !== t.id));
        }, 3000);
      }
    };
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: "fixed", top: 16, right: 16, zIndex: 999,
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "12px 20px", borderRadius: 10,
            background: t.type === "success" ? "var(--success)" : "var(--danger)",
            color: "white", fontWeight: 600, fontSize: 14,
            boxShadow: "var(--shadow-lg)", animation: "slideIn 0.3s ease",
            maxWidth: 280,
          }}
        >
          {t.type === "success" ? "✅ " : "❌ "}{t.message}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}
