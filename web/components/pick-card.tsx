'use client';
import { cn } from '@/lib/utils';
import { GradeBadge } from './grade-badge';
import { SPORTS, RECOMMENDATION_COLORS, type SportKey } from '@/lib/sports-config';
import { Bookmark, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface PickCardProps {
  id: string;
  playerName: string;
  team: string;
  sport: SportKey;
  statType: string;
  line: number;
  odds: number;
  grade: string;
  confidence: number;
  recommendation: string;
  edgeSummary: string;
  blurred?: boolean;
  onSave?: () => void;
  onAddParlay?: () => void;
  onClick?: () => void;
}

export function PickCard({
  playerName,
  team,
  sport,
  statType,
  line,
  odds,
  grade,
  confidence,
  recommendation,
  edgeSummary,
  blurred = false,
  onSave,
  onAddParlay,
  onClick,
}: PickCardProps) {
  const sportConfig = SPORTS[sport];
  const SportIcon = sportConfig?.icon;
  const recColor = RECOMMENDATION_COLORS[recommendation] ?? '#6B7280';

  const isOver = recommendation?.toLowerCase()?.includes('over');
  const isUnder = recommendation?.toLowerCase()?.includes('under');
  const RecIcon = isOver ? TrendingUp : isUnder ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        'group relative bg-card rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg border border-border/50',
        blurred && 'paywall-blur'
      )}
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <GradeBadge grade={grade} confidence={confidence} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{playerName ?? 'Unknown'}</span>
              <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                {team ?? ''}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {SportIcon && <SportIcon className="h-3 w-3 text-muted-foreground" />}
              <span className="text-xs text-muted-foreground">{sportConfig?.shortName}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{statType}</span>
            </div>
          </div>
        </div>

        {/* Recommendation badge */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
          style={{ backgroundColor: `${recColor}20`, color: recColor }}
        >
          <RecIcon className="h-3 w-3" />
          {recommendation ?? 'N/A'}
        </div>
      </div>

      {/* Line + Odds */}
      <div className="flex items-center gap-4 mb-3">
        <div className="bg-secondary rounded-lg px-3 py-1.5">
          <span className="text-xs text-muted-foreground">Line</span>
          <span className="block text-sm font-mono font-semibold text-foreground">
            {line ?? 0}
          </span>
        </div>
        <div className="bg-secondary rounded-lg px-3 py-1.5">
          <span className="text-xs text-muted-foreground">Best Odds</span>
          <span className="block text-sm font-mono font-semibold text-foreground">
            {(odds ?? 0) > 0 ? `+${odds}` : odds}
          </span>
        </div>
      </div>

      {/* Edge summary */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
        {edgeSummary ?? ''}
      </p>

      {/* Action buttons — always visible on touch, hover-revealed from md up.
          `opacity-0` alone left them unusable on phones, which have no hover. */}
      <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
        <button
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onSave?.(); }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary bg-secondary px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Bookmark className="h-3 w-3" /> Save
        </button>
        <button
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onAddParlay?.(); }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary bg-secondary px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="h-3 w-3" /> Add to Parlay
        </button>
      </div>
    </motion.div>
  );
}
