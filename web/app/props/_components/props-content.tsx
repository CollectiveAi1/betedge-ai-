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
import { Target, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function PropsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sport, setSport] = useState<SportKey | 'all'>('all');
  const [search, setSearch] = useState('');
  const [props, setProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tier = (session?.user as any)?.subscriptionTier ?? 'FREE';
  const limits = getTierLimits(tier);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (sport !== 'all') params.set('sport', sport);
        if (search) params.set('search', search);
        const res = await fetch(`/api/sports/props?${params.toString()}`);
        const data = await res.json().catch(() => ({}));
        setProps(data?.props ?? []);
      } catch {
        setProps([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sport, search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Player Props
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Browse player props by sport, team, or player. Each prop graded by AI.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <SportFilter selected={sport} onSelect={setSport} />
          <div className="relative sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search player or team..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_: unknown, i: number) => (
              <PickCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(props ?? []).map((prop: any, i: number) => {
              const isLocked = tier === 'FREE' && i >= limits.dailyProps;
              return (
                <PaywallGate key={prop?.id ?? i} isLocked={isLocked}>
                  <PickCard
                    id={prop?.id ?? ''}
                    playerName={prop?.playerName ?? 'Unknown'}
                    team={prop?.team ?? ''}
                    sport={prop?.sport ?? 'nfl'}
                    statType={prop?.statType ?? ''}
                    line={prop?.line ?? 0}
                    odds={prop?.overOdds ?? 0}
                    grade={prop?.grade ?? 'C'}
                    confidence={prop?.confidence ?? 0}
                    recommendation={prop?.recommendation ?? ''}
                    edgeSummary={prop?.edgeSummary ?? ''}
                    onSave={() => toast.success('Prop saved!')}
                    onAddParlay={() => toast.success('Added to parlay!')}
                    onClick={() => router.push(`/props/${prop?.id ?? ''}`)}
                  />
                </PaywallGate>
              );
            })}
          </div>
        )}

        {(props ?? []).length === 0 && !loading && (
          <div className="text-center py-16">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No props found</h3>
            <p className="text-sm text-muted-foreground">Try a different sport or search term.</p>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
