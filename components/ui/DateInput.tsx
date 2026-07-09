"use client";

import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes, useState, useCallback } from "react";
import { Calendar } from "lucide-react";

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  label?: string;
  error?: string;
}

/**
 * Date input with native calendar picker + dd/mm/yyyy text display.
 * Stores value as yyyy-mm-dd internally (HTML spec), displays as dd/mm/yyyy.
 */
export function DateInput({ label, error, className, id, defaultValue, required, name, ...props }: DateInputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  // Convert yyyy-mm-dd (defaultValue) to display format dd/mm/yyyy
  const isoToDisplay = (iso: string | undefined | null): string => {
    if (!iso) return "";
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const displayToIso = (display: string): string => {
    // Accept dd/mm/yyyy or d/m/yyyy or yyyy-mm-dd
    const ddmmyyyy = display.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, d, m, y] = ddmmyyyy;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    // If already yyyy-mm-dd, pass through
    if (/^\d{4}-\d{2}-\d{2}$/.test(display)) return display;
    return display;
  };

  const [displayValue, setDisplayValue] = useState(isoToDisplay(defaultValue as string));
  const [isoValue, setIsoValue] = useState((defaultValue as string) || "");

  const handleDisplayChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    // Only update ISO if it matches dd/mm/yyyy or is being cleared
    const iso = displayToIso(raw);
    if (iso || raw === "") {
      setIsoValue(iso);
    }
  }, []);

  const handleCalendarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const iso = e.target.value; // yyyy-mm-dd from native picker
    setIsoValue(iso);
    setDisplayValue(isoToDisplay(iso));
  }, []);

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Text input showing dd/mm/yyyy */}
        <input
          id={inputId}
          type="text"
          className={cn("form-input", className)}
          value={displayValue}
          onChange={handleDisplayChange}
          placeholder="dd/mm/yyyy"
          style={{ flex: 1 }}
          {...props}
        />
        {/* Hidden native date picker triggered by calendar icon */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <input
            type="date"
            value={isoValue}
            onChange={handleCalendarChange}
            aria-label={label ? `${label} 日历选择` : "日历选择"}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
          <Calendar
            size={20}
            style={{
              color: "var(--text-muted)",
              cursor: "pointer",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={isoValue} />
      {error && (
        <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}
