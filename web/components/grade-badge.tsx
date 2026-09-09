'use client';
import { cn } from '@/lib/utils';
import { GRADE_COLORS } from '@/lib/sports-config';

interface GradeBadgeProps {
  grade: string;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
  className?: string;
}

export function GradeBadge({
  grade,
  confidence,
  size = 'md',
  showConfidence = true,
  className,
}: GradeBadgeProps) {
  const color = GRADE_COLORS[grade ?? 'C'] ?? '#6B7280';
  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-10 w-10 text-base',
    lg: 'h-14 w-14 text-xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg font-bold font-mono',
          sizeClasses[size]
        )}
        style={{ backgroundColor: `${color}20`, color }}
      >
        {grade ?? '?'}
      </div>
      {showConfidence && confidence != null && (
        <span className="text-xs text-muted-foreground font-mono">
          {confidence}%
        </span>
      )}
    </div>
  );
}
