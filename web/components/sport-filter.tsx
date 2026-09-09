'use client';
import { cn } from '@/lib/utils';
import { SPORTS, type SportKey, SPORT_KEYS } from '@/lib/sports-config';

interface SportFilterProps {
  selected: SportKey | 'all';
  onSelect: (sport: SportKey | 'all') => void;
  className?: string;
}

export function SportFilter({ selected, onSelect, className }: SportFilterProps) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-1', className)}>
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
          selected === 'all'
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        )}
      >
        All Sports
      </button>
      {SPORT_KEYS.map((key: SportKey) => {
        const sport = SPORTS[key];
        if (!sport) return null;
        const Icon = sport.icon;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              selected === key
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            )}
          >
            <Icon className="h-4 w-4" />
            {sport.shortName}
          </button>
        );
      })}
    </div>
  );
}
