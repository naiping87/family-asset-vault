import { cn } from "@/lib/utils/cn";
import { Card } from "./Card";
import type { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  iconColor: "blue" | "green" | "amber" | "purple";
  label: string;
  value: string;
  sub?: string;
  subUp?: boolean;
}

export function StatsCard({
  icon,
  iconColor,
  label,
  value,
  sub,
  subUp,
}: StatsCardProps) {
  return (
    <Card variant="default" className="stat-card">
      <div className={cn("stat-icon", iconColor)}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && (
        <div className={cn("stat-sub", subUp && "up")}>{sub}</div>
      )}
    </Card>
  );
}
