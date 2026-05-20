import { cn } from '@/lib/utils/cn';

export default function Button({ variant = 'primary', size, icon, className, children, ...props }) {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        size === 'sm' && 'btn-sm',
        size === 'xs' && 'btn-xs',
        size === 'icon' && 'btn-icon',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
