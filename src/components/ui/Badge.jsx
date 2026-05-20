import { cn } from '@/lib/utils/cn';

const colorClasses = {
  blue: 'badge-blue',
  green: 'badge-green',
  amber: 'badge-amber',
  purple: 'badge-purple',
  gray: 'badge-gray',
  red: 'badge-red',
};

export default function Badge({ color = 'blue', children, className }) {
  return (
    <span className={cn('badge', colorClasses[color] || colorClasses.blue, className)}>
      {children}
    </span>
  );
}

export function StatusDot({ color = 'green' }) {
  return <span className={cn('status-dot', color)} />;
}
