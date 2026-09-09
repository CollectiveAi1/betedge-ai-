'use client';
import { cn } from '@/lib/utils';

interface TrendBarProps {
  hits: number;
  total: number;
  label?: string;
  className?: string;
}

export function TrendBar({ hits, total, label, className }: TrendBarProps) {
  const safeTotal = total || 1;
  const percentage = Math.round(((hits ?? 0) / safeTotal) * 100);
  const isGood = percentage >= 60;

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className={cn('font-mono font-semibold', isGood ? 'text-primary' : 'text-amber-400')}>
            {hits}/{total} ({percentage}%)
          </span>
        </div>
      )}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', isGood ? 'bg-primary' : 'bg-amber-400')}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Individual game indicators */}
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_: unknown, i: number) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              i < (hits ?? 0) ? (isGood ? 'bg-primary' : 'bg-amber-400') : 'bg-secondary'
            )}
          />
        ))}
      </div>
    </div>
  );
}
