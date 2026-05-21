"use client";

import { cn } from "@/lib/utils/cn";

interface FilterPill {
  key: string;
  label: string;
  count?: number;
}

interface FilterPillsProps {
  pills: FilterPill[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function FilterPills({
  pills,
  activeKey,
  onChange,
  className,
}: FilterPillsProps) {
  return (
    <div className={cn("filter-pills", className)}>
      {pills.map((pill) => (
        <button
          key={pill.key}
          className={cn("filter-pill", activeKey === pill.key && "active")}
          onClick={() => onChange(pill.key)}
        >
          {pill.label}
          {pill.count !== undefined && (
            <span style={{ marginLeft: 6, opacity: 0.7 }}>{pill.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
