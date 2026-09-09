'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { OddsTable } from '@/components/odds-table';
import { GradeBadge } from '@/components/grade-badge';
import { PaywallGate } from '@/components/paywall-gate';
import { PickCardSkeleton } from '@/components/loading-skeleton';
import { getTierLimits } from '@/lib/tier-limits';
import { ArrowLeft, Clock, MapPin, Target } from 'lucide-react';
import Link from 'next/link';

interface GameDetailContentProps {
  gameId: string;
}

export function GameDetailContent({ gameId }: GameDetailContentProps) {
  const { data: session } = useSession();
  const tier = (session?.user as any)?.subscriptionTier ?? 'FREE';
  const limits = getTierLimits(tier);

  const [game, setGame] = useState<any>(null);
  const [odds, setOdds] = useState<any[]>([]);
  const [props, setProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [gamesRes, oddsRes, propsRes] = await Promise.all([
          fetch(`/api/sports/games?gameId=${gameId}`),
          fetch(`/api/sports/odds?gameId=${gameId}`),
          fetch(`/api/sports/props?gameId=${gameId}`),
        ]);
        const gamesData = await gamesRes.json().catch(() => ({}));
        const oddsData = await oddsRes.json().catch(() => ({}));
        const propsData = await propsRes.json().catch(() => ({}));
        setGame(gamesData?.game ?? gamesData?.games?.[0] ?? null);
        setOdds(oddsData?.odds ?? []);
        setProps(propsData?.props ?? []);
      } catch {
        // keep empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [gameId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <Link href="/games" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Games
        </Link>

        {loading ? (
          <div className="space-y-4">
            <PickCardSkeleton />
            <PickCardSkeleton />
          </div>
        ) : game ? (
          <>
            {/* Game header */}
            <div className="bg-card rounded-xl p-6 border border-border/50 mb-6" style={{ boxShadow: 'var(--shadow-md)' }}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Clock className="h-3 w-3" />
                <span suppressHydrationWarning>
                  {game?.startTime ? new Date(game.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' }) : 'TBD'}
                </span>
                {game?.venue && (
                  <>
                    <span>·</span>
                    <MapPin className="h-3 w-3" />
                    <span>{game.venue}</span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-6 text-center">
                <div>
                  <div className="text-xl font-bold text-foreground">{game?.awayTeam ?? 'Away'}</div>
                </div>
                <div className="text-2xl font-mono text-muted-foreground">@</div>
                <div>
                  <div className="text-xl font-bold text-foreground">{game?.homeTeam ?? 'Home'}</div>
                </div>
              </div>
            </div>

            {/* Odds table */}
            <div className="bg-card rounded-xl p-4 border border-border/50 mb-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="font-display text-lg font-bold text-foreground mb-3">Odds Comparison</h2>
              <PaywallGate isLocked={false}>
                <OddsTable
                  odds={odds}
                  homeTeam={game?.homeTeam ?? 'Home'}
                  awayTeam={game?.awayTeam ?? 'Away'}
                  maxBooks={limits.maxBooks}
                />
              </PaywallGate>
            </div>

            {/* Player props */}
            {(props ?? []).length > 0 && (
              <div className="bg-card rounded-xl p-4 border border-border/50" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-lg font-bold text-foreground">Player Props</h2>
                </div>
                <div className="space-y-3">
                  {(props ?? []).map((prop: any, i: number) => (
                    <PaywallGate key={prop?.id ?? i} isLocked={tier === 'FREE' && i >= limits.dailyProps}>
                      <Link href={`/props/${prop?.id ?? ''}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                          <div className="flex items-center gap-3">
                            <GradeBadge grade={prop?.grade ?? 'C'} confidence={prop?.confidence} size="sm" />
                            <div>
                              <div className="font-medium text-sm text-foreground">{prop?.playerName ?? 'Player'}</div>
                              <div className="text-xs text-muted-foreground">{prop?.statType ?? ''} — Line: {prop?.line ?? 0}</div>
                            </div>
                          </div>
                          <span className="text-xs font-bold" style={{ color: prop?.recommendation?.includes('OVER') ? '#22C55E' : prop?.recommendation?.includes('UNDER') ? '#EF4444' : '#6B7280' }}>
                            {prop?.recommendation ?? ''}
                          </span>
                        </div>
                      </Link>
                    </PaywallGate>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-foreground">Game not found</h3>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
