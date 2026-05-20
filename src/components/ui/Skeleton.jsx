import { cn } from '@/lib/utils/cn';

export default function Skeleton({ width, height, className, style }) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{ width: width || '100%', height: height || '20px', ...style }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="stat-card glass">
      <Skeleton width={44} height={44} style={{ borderRadius: 12 }} />
      <Skeleton width="60%" height={18} />
      <Skeleton width="40%" height={30} />
      <Skeleton width="80%" height={14} />
    </div>
  );
}
