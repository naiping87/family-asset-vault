import { cn } from "@/lib/utils/cn";

type BadgeColor = "blue" | "green" | "amber" | "purple" | "gray" | "red";

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  blue: "badge-blue",
  green: "badge-green",
  amber: "badge-amber",
  purple: "badge-purple",
  gray: "badge-gray",
  red: "badge-red",
};

export function Badge({ color = "blue", children, className }: BadgeProps) {
  return (
    <span className={cn("badge", colorClasses[color], className)}>
      {children}
    </span>
  );
}
