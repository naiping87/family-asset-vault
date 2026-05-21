"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  actions,
}: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className={cn("dialog", "glass-intense")}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <div className="dialog-title">{title}</div>}
        {description && <div className="dialog-desc">{description}</div>}
        {children}
        {actions && <div className="dialog-actions">{actions}</div>}
      </div>
    </div>
  );
}
