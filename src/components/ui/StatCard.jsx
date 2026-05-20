import { cn } from '@/lib/utils/cn';

export default function StatCard({ icon, iconColor = 'blue', label, value, sub, subUp, className }) {
  return (
    <div className={cn('stat-card glass', className)}>
      <div className={cn('stat-icon', iconColor)}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value || '—'}</div>
      {sub && <div className={cn('stat-sub', subUp && 'up')}>{sub}</div>}
    </div>
  );
}
