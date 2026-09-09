'use client';
import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { SportFilter } from '@/components/sport-filter';
import { PickCard } from '@/components/pick-card';
import { LockedPicksNotice } from '@/components/locked-picks-notice';
import { PickCardSkeleton } from '@/components/loading-skeleton';
import type { SportKey } from '@/lib/sports-config';
import { Target, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { addPickToParlay, savePickToTracker, type PickLike } from '@/lib/pick-actions';

export function PropsContent() {
  const router = useRouter();
  const [sport, setSport] = useState<SportKey | 'all'>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [props, setProps] = useState<any[]>([]);
  const [totalProps, setTotalProps] = useState(0);
  const [loading, setLoading] = useState(true);


  // Debounced so typing a player name issues one request instead of one per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (sport !== 'all') params.set('sport', sport);
        if (debouncedSearch) params.set('search', debouncedSearch);
        const res = await fetch(`/api/sports/props?${params.toString()}`);
        const data = await res.json().catch(() => ({}));
        setProps(data?.props ?? []);
        setTotalProps(data?.total ?? data?.props?.length ?? 0);
      } catch {
        setProps([]);
        setTotalProps(0);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sport, debouncedSearch]);

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
              const pick: PickLike = {
                id: prop?.id ?? '',
                playerName: prop?.playerName ?? 'Unknown',
                team: prop?.team ?? '',
                sport: prop?.sport ?? 'nfl',
                statType: prop?.statType ?? '',
                line: prop?.line ?? 0,
                odds: prop?.overOdds ?? 0,
                recommendation: prop?.recommendation ?? '',
              };
              return (
                <PickCard
                  key={prop?.id ?? i}
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
                  onSave={() => savePickToTracker(pick)}
                  onAddParlay={() => addPickToParlay(pick)}
                  onClick={() => router.push(`/props/${prop?.id ?? ''}`)}
                />
              );
            })}
            <LockedPicksNotice hidden={totalProps - props.length} noun="prop" />
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
