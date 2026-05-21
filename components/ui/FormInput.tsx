import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormInput({
  label,
  error,
  className,
  id,
  ...props
}: FormInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn("form-input", className)}
        {...props}
      />
      {error && (
        <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}
