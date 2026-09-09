import { getCached, setCache, ESPN_CACHE_TTL } from '@/lib/cache';
import { SPORTS, type SportKey } from '@/lib/sports-config';

export interface Game {
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

/** Game ids are `<sport>-<espnEventId>`, so the sport is recoverable from the id alone. */
export function sportFromGameId(gameId: string): SportKey | null {
  const prefix = gameId.split('-')[0];
  return prefix && prefix in SPORTS ? (prefix as SportKey) : null;
}

/** ESPN's scoreboard takes a `YYYYMMDD` date; `offsetDays` of 1 is tomorrow. */
function espnDate(offsetDays: number): string {
  const d = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

export async function fetchESPNGames(sportKey: SportKey, offsetDays = 0): Promise<Game[]> {
  const cfg = SPORTS[sportKey];
  if (!cfg) return [];
  const dateStr = espnDate(offsetDays);
  const cacheKey = `espn-games-${sportKey}-${dateStr}`;
  const cached = getCached<Game[]>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${cfg.espnSport}/${cfg.espnLeague}/scoreboard?dates=${dateStr}`;
    const res = await fetch(url, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error(`ESPN ${res.status}`);
    const data = await res.json();
    const events: Game[] = (data?.events ?? []).map((ev: any) => {
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
