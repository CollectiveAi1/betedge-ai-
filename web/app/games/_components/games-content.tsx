'use client';
import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { SportFilter } from '@/components/sport-filter';
import { GameCardSkeleton } from '@/components/loading-skeleton';
import { SPORTS, type SportKey } from '@/lib/sports-config';
import { Gamepad2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface GameData {
  id: string;
  sport: SportKey;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  startTime: string;
  status: string;
  venue: string;
}

export function GamesContent() {
  const [sport, setSport] = useState<SportKey | 'all'>('all');
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = sport !== 'all' ? `?sport=${sport}` : '';
        const res = await fetch(`/api/sports/games${params}`);
        const data = await res.json().catch(() => ({}));
        setGames(data?.games ?? []);
      } catch {
        setGames([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sport]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Today&apos;s Games
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            All games today and tomorrow with key markets and AI grades.
          </p>
        </div>

        <SportFilter selected={sport} onSelect={setSport} className="mb-6" />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_: unknown, i: number) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(games ?? []).map((game: GameData, i: number) => {
              const sportCfg = SPORTS[game?.sport ?? 'nfl'];
              const SportIcon = sportCfg?.icon;
              const gameTime = game?.startTime ? new Date(game.startTime) : null;
              return (
                <motion.div
                  key={game?.id ?? i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link href={`/games/${game?.id ?? ''}`}>
                    <div className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer" style={{ boxShadow: 'var(--shadow-sm)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {SportIcon && <SportIcon className="h-4 w-4 text-muted-foreground" />}
                          <span className="text-xs font-medium text-muted-foreground">{sportCfg?.shortName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span suppressHydrationWarning>
                            {gameTime ? gameTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) : 'TBD'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground text-sm">{game?.awayTeam ?? 'Away'}</span>
                        <span className="text-xs text-muted-foreground">@</span>
                        <span className="font-semibold text-foreground text-sm">{game?.homeTeam ?? 'Home'}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {game?.venue ?? ''}
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {(games ?? []).length === 0 && !loading && (
          <div className="text-center py-16">
            <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No games today</h3>
            <p className="text-sm text-muted-foreground">Check back on game days for live coverage.</p>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
