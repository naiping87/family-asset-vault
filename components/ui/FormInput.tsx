"use client";

import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormInput({ label, error, className, id, ...props }: FormInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const isPassword = props.type === "password";
  const [show, setShow] = useState(false);

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          id={inputId}
          className={cn("form-input", className)}
          {...props}
          type={isPassword ? (show ? "text" : "password") : props.type}
          style={isPassword ? { paddingRight: 40 } : undefined}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            tabIndex={-1}
            aria-label={show ? "隐藏密码" : "显示密码"}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}
