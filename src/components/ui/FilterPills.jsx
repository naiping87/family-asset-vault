'use client';
import { cn } from '@/lib/utils/cn';

export default function FilterPills({ options, active, onChange }) {
  return (
    <div className="filter-pills">
      {options.map(opt => (
        <button
          key={opt.value}
          className={cn('filter-pill', active === opt.value && 'active')}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && <span>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
