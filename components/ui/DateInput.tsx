"use client";

import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes, useState, useCallback, useRef, useEffect } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  label?: string;
  error?: string;
}

/** Convert yyyy-mm-dd to dd/mm/yyyy display */
function isoToDisplay(iso: string | undefined | null): string {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/** Convert dd/mm/yyyy to yyyy-mm-dd. Returns null if incomplete/invalid. */
function displayToIso(display: string): string | null {
  const match = display.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const d = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const y = parseInt(match[3], 10);
  if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Apply dd/mm/yyyy mask as user types. Only allows digits; auto-inserts slashes. */
function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

export function DateInput({
  label,
  error,
  className,
  id,
  defaultValue,
  required,
  name,
  ...props
}: DateInputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const initialIso = (defaultValue as string) || "";
  const [displayValue, setDisplayValue] = useState(isoToDisplay(initialIso));
  const [isoValue, setIsoValue] = useState(initialIso);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedDate = (() => {
    if (!isoValue) return undefined;
    const parts = isoValue.split("-");
    if (parts.length !== 3) return undefined;
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  })();

  // Close popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [isOpen]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyMask(e.target.value);
    setDisplayValue(masked);
    const iso = displayToIso(masked);
    if (iso) setIsoValue(iso);
    if (masked === "") setIsoValue("");
  }, []);

  const handleDaySelect = useCallback((date: Date | undefined) => {
    if (date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const iso = `${y}-${m}-${d}`;
      setIsoValue(iso);
      setDisplayValue(isoToDisplay(iso));
    } else {
      setIsoValue("");
      setDisplayValue("");
    }
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayValue("");
    setIsoValue("");
    inputRef.current?.focus();
  }, []);

  const handleToday = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const iso = `${y}-${m}-${d}`;
    setIsoValue(iso);
    setDisplayValue(isoToDisplay(iso));
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  const isValid = displayValue === "" || displayToIso(displayValue) !== null;
  const showError = !isValid && displayValue !== "";

  const rdpClassNames = getDefaultClassNames();

  return (
    <div className="form-group" ref={containerRef} style={{ position: "relative" }}>
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
          {required && <span style={{ color: "var(--danger)", marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div
        className={cn("form-input", className)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "text",
          borderColor: showError ? "var(--danger)" : isFocused ? "var(--brand)" : undefined,
          boxShadow: isFocused ? "0 0 0 2px rgba(99,102,241,0.2)" : undefined,
          paddingRight: 8,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="dd/mm/yyyy"
          inputMode="numeric"
          autoComplete="off"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "inherit",
            fontFamily: "inherit",
            color: "var(--text-primary)",
            padding: 0,
            minWidth: 0,
          }}
          {...props}
        />
        {displayValue && (
          <button
            type="button"
            onClick={handleClear}
            tabIndex={-1}
            aria-label="清除日期"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              display: "flex",
              alignItems: "center",
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          tabIndex={-1}
          aria-label="打开日历"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            display: "flex",
            alignItems: "center",
            color: isOpen ? "var(--brand)" : "var(--text-muted)",
            flexShrink: 0,
          }}
        >
          <Calendar size={18} />
        </button>
      </div>

      {/* Popover calendar */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            marginTop: 6,
            background: "var(--glass-bg-intense, rgba(255,255,255,0.95))",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--glass-border, rgba(255,255,255,0.2))",
            borderRadius: "var(--radius, 12px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            padding: 12,
          }}
        >
          <style>{`
            .rdp-custom { --rdp-accent-color: var(--brand, #6366f1); --rdp-background-color: var(--glass-bg-subtle, #f3f4f6); }
            .rdp-custom .rdp-day-button { border-radius: 8px; transition: all 0.15s; }
            .rdp-custom .rdp-day-button:hover { background: var(--glass-bg-intense); }
            .rdp-custom .rdp-selected .rdp-day-button { background: var(--brand, #6366f1); color: white; }
            .rdp-custom .rdp-today .rdp-day-button { border: 1px solid var(--brand, #6366f1); color: var(--brand, #6366f1); font-weight: 600; }
            .rdp-custom .rdp-today.rdp-selected .rdp-day-button { color: white; }
            .rdp-custom .rdp-chevron { fill: var(--text-muted); }
            .rdp-custom .rdp-weekday { color: var(--text-muted); font-size: 0.75rem; font-weight: 500; }
            .rdp-custom .rdp-month-caption { font-weight: 600; color: var(--text-primary); }
            .rdp-custom .rdp-dropdown { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 6px; padding: 4px 8px; font-size: 0.875rem; color: var(--text-primary); }
            .rdp-custom .rdp-nav button { border-radius: 6px; }
            .rdp-custom .rdp-nav button:hover { background: var(--glass-bg-intense); }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDaySelect}
            weekStartsOn={1}
            captionLayout="dropdown"
            classNames={{
              ...rdpClassNames,
              root: cn(rdpClassNames.root, "rdp-custom"),
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />,
            }}
            footer={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: "1px solid var(--glass-border)",
                }}
              >
                <button
                  type="button"
                  onClick={handleToday}
                  style={{
                    background: "none",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                    color: "var(--brand)",
                    fontWeight: 500,
                  }}
                >
                  今天
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    background: "none",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                >
                  清除
                </button>
              </div>
            }
          />
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={isoValue} required={required} />

      {showError && (
        <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 4 }}>
          日期格式无效，请使用 dd/mm/yyyy
        </p>
      )}
      {error && (
        <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}
