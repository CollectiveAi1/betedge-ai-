'use client';
import { cn } from '@/lib/utils';

export function PickCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-card rounded-xl p-4 animate-pulse border border-border/50', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary" />
          <div>
            <div className="h-4 w-32 bg-secondary rounded mb-1" />
            <div className="h-3 w-20 bg-secondary rounded" />
          </div>
        </div>
        <div className="h-6 w-24 bg-secondary rounded-lg" />
      </div>
      <div className="flex gap-4 mb-3">
        <div className="h-12 w-20 bg-secondary rounded-lg" />
        <div className="h-12 w-20 bg-secondary rounded-lg" />
      </div>
      <div className="h-4 w-full bg-secondary rounded mb-1" />
      <div className="h-4 w-3/4 bg-secondary rounded" />
    </div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="bg-card rounded-xl p-4 animate-pulse border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-secondary rounded" />
        <div className="h-4 w-16 bg-secondary rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-5 w-36 bg-secondary rounded" />
        <div className="h-5 w-10 bg-secondary rounded" />
        <div className="h-5 w-36 bg-secondary rounded" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_: unknown, i: number) => (
        <div key={i} className="h-10 bg-secondary rounded animate-pulse" />
      ))}
    </div>
  );
}
