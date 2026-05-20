import { cn } from '@/lib/utils/cn';

const variants = {
  default: 'glass',
  intense: 'glass-intense',
  subtle: 'glass-subtle',
};

export default function GlassCard({ variant = 'default', className, children, style, ...props }) {
  return (
    <div className={cn(variants[variant] || variants.default, className)} style={style} {...props}>
      {children}
    </div>
  );
}
