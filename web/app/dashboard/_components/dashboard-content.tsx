'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { SportFilter } from '@/components/sport-filter';
import { PickCard } from '@/components/pick-card';
import { PaywallGate } from '@/components/paywall-gate';
import { PickCardSkeleton } from '@/components/loading-skeleton';
import type { SportKey } from '@/lib/sports-config';
import { getTierLimits } from '@/lib/tier-limits';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TrendingUp, Flame, Clock } from 'lucide-react';

interface PickData {
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
}

export function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sport, setSport] = useState<SportKey | 'all'>('all');
  const [picks, setPicks] = useState<PickData[]>([]);
  const [loading, setLoading] = useState(true);

  const tier = (session?.user as any)?.subscriptionTier ?? 'FREE';
  const limits = getTierLimits(tier);

  useEffect(() => {
    async function loadPicks() {
      setLoading(true);
      try {
        const params = sport !== 'all' ? `?sport=${sport}` : '';
        const res = await fetch(`/api/dashboard/picks${params}`);
        const data = await res.json().catch(() => ({}));
        setPicks(data?.picks ?? []);
      } catch {
        setPicks([]);
      } finally {
        setLoading(false);
      }
    }
    loadPicks();
  }, [sport]);

  async function handleSave(pick: PickData) {
    try {
      const res = await fetch('/api/user/picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: pick.sport,
          league: pick.sport?.toUpperCase(),
          marketType: 'PROP',
          description: `${pick.playerName} ${pick.statType} ${pick.recommendation}`,
          selection: pick.recommendation,
          odds: pick.odds,
        }),
      });
      if (res.ok) {
        toast.success('Pick saved to tracker!');
      } else {
        toast.error('Failed to save pick');
      }
    } catch {
      toast.error('Failed to save pick');
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Today&apos;s AI Picks
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-graded picks refreshed throughout the day. Tap any pick for full analysis.
          </p>
        </div>

        {/* Sport filter */}
        <SportFilter selected={sport} onSelect={setSport} className="mb-6" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" /> Today&apos;s Picks
            </div>
            <span className="text-lg font-bold font-mono text-foreground">
              {picks?.length ?? 0}
            </span>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Flame className="h-3 w-3" /> A-Grade
            </div>
            <span className="text-lg font-bold font-mono text-primary">
              {(picks ?? []).filter((p: PickData) => p?.grade === 'A').length}
            </span>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" /> Views Left
            </div>
            <span className="text-lg font-bold font-mono text-foreground">
              {tier === 'FREE' ? `${Math.max(0, limits.dailyPicks - (picks?.length ?? 0))}` : '∞'}
            </span>
          </div>
        </div>

        {/* Picks grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_: unknown, i: number) => (
              <PickCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(picks ?? []).map((pick: PickData, i: number) => {
              const isLocked = tier === 'FREE' && i >= limits.dailyPicks;
              return (
                <PaywallGate key={pick?.id ?? i} isLocked={isLocked}>
                  <PickCard
                    id={pick?.id ?? ''}
                    playerName={pick?.playerName ?? 'Unknown'}
                    team={pick?.team ?? ''}
                    sport={pick?.sport ?? 'nfl'}
                    statType={pick?.statType ?? ''}
                    line={pick?.line ?? 0}
                    odds={pick?.odds ?? 0}
                    grade={pick?.grade ?? 'C'}
                    confidence={pick?.confidence ?? 0}
                    recommendation={pick?.recommendation ?? 'N/A'}
                    edgeSummary={pick?.edgeSummary ?? ''}
                    onSave={() => handleSave(pick)}
                    onAddParlay={() => toast.success('Added to parlay!')}
                    onClick={() => router.push(`/props/${pick?.id ?? ''}`)}
                  />
                </PaywallGate>
              );
            })}
          </div>
        )}

        {(picks ?? []).length === 0 && !loading && (
          <div className="text-center py-16">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No picks available</h3>
            <p className="text-sm text-muted-foreground">Check back later — picks are refreshed throughout the day.</p>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
