import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function Skeleton({ className, width, height = 16 }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      style={{ width, height }}
    />
  );
}
