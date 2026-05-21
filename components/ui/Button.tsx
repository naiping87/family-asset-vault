import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "default" | "sm" | "xs" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "",
  sm: "btn-sm",
  xs: "btn-xs",
  icon: "btn-icon",
};

export function Button({
  variant = "primary",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("btn", variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}
