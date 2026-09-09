export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCached, setCache, ESPN_CACHE_TTL } from '@/lib/cache';
import { SPORTS, type SportKey, SPORT_KEYS } from '@/lib/sports-config';
import { getMockGames } from '@/lib/mock-data';

async function fetchESPNGames(sportKey: SportKey) {
  const cfg = SPORTS[sportKey];
  if (!cfg) return [];
  const cacheKey = `espn-games-${sportKey}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const url = `https://site.api.espn.com/apis/site/v2/sports/${cfg.espnSport}/${cfg.espnLeague}/scoreboard?dates=${dateStr}`;
    const res = await fetch(url, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error(`ESPN ${res.status}`);
    const data = await res.json();
    const events = (data?.events ?? []).map((ev: any) => {
      const comp = ev?.competitions?.[0];
      const home = comp?.competitors?.find((c: any) => c?.homeAway === 'home');
      const away = comp?.competitors?.find((c: any) => c?.homeAway === 'away');
      return {
        id: `${sportKey}-${ev?.id ?? ''}`,
        sport: sportKey,
        homeTeam: home?.team?.displayName ?? 'Home',
        awayTeam: away?.team?.displayName ?? 'Away',
        homeScore: home?.score != null ? Number(home.score) : null,
        awayScore: away?.score != null ? Number(away.score) : null,
        startTime: ev?.date ?? '',
        status: ev?.status?.type?.name ?? 'scheduled',
        venue: comp?.venue?.fullName ?? '',
      };
    });
    setCache(cacheKey, events, ESPN_CACHE_TTL);
    return events;
  } catch (err: any) {
    console.error(`ESPN fetch error for ${sportKey}:`, err?.message);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportParam = searchParams.get('sport') as SportKey | null;
    const gameId = searchParams.get('gameId');

    let allGames: any[] = [];

    if (sportParam && SPORTS[sportParam]) {
      allGames = await fetchESPNGames(sportParam);
    } else {
      const promises = SPORT_KEYS.map((k: SportKey) => fetchESPNGames(k));
      const results = await Promise.all(promises);
      allGames = results.flat();
    }

    // Fallback to mock if empty
    if (allGames.length === 0) {
      allGames = getMockGames(sportParam ?? undefined);
    }

    if (gameId) {
      const game = allGames.find((g: any) => g?.id === gameId);
      return NextResponse.json({ game: game ?? null, games: game ? [game] : [] });
    }

    return NextResponse.json({ games: allGames });
  } catch (error: any) {
    console.error('Games API error:', error);
    return NextResponse.json({ games: getMockGames() });
  }
}
