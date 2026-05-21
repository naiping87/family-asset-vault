import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

type CardVariant = "default" | "intense" | "subtle";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: "glass",
  intense: "glass-intense",
  subtle: "glass-subtle",
};

export function Card({
  variant = "default",
  className,
  onClick,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(variantClasses[variant], className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    />
  );
}
