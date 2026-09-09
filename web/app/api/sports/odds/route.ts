export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCached, setCache, ODDS_CACHE_TTL } from '@/lib/cache';
import { SPORTS, type SportKey } from '@/lib/sports-config';
import { fetchESPNGames, sportFromGameId } from '@/lib/espn';
import { getMockOdds } from '@/lib/mock-data';

interface Book {
  bookmaker: string;
  moneyline: { home: number; away: number };
  spread: { home: number; away: number; homeOdds: number; awayOdds: number };
  total: { line: number; over: number; under: number };
}

/**
 * Team names differ between ESPN ("Kansas City Chiefs") and The Odds API, so match on
 * the last word of the name — the nickname — which is what the two agree on.
 */
function nickname(team: string): string {
  return team.trim().toLowerCase().split(/\s+/).pop() ?? '';
}

function outcomeFor(market: any, team: string) {
  const nick = nickname(team);
  return (market?.outcomes ?? []).find((o: any) => nickname(String(o?.name ?? '')) === nick);
}

/**
 * Flattens one Odds API event into per-book rows. `home`/`away` are read by team name
 * rather than by array position, because the API does not guarantee an ordering.
 */
function toBooks(event: any, homeTeam: string, awayTeam: string): Book[] {
  return (event?.bookmakers ?? []).map((bm: any): Book => {
    const h2h = bm?.markets?.find((m: any) => m?.key === 'h2h');
    const spreads = bm?.markets?.find((m: any) => m?.key === 'spreads');
    const totals = bm?.markets?.find((m: any) => m?.key === 'totals');

    const homeSpread = outcomeFor(spreads, homeTeam);
    const awaySpread = outcomeFor(spreads, awayTeam);
    const over = (totals?.outcomes ?? []).find((o: any) => o?.name === 'Over');
    const under = (totals?.outcomes ?? []).find((o: any) => o?.name === 'Under');

    return {
      bookmaker: bm?.title ?? 'Unknown',
      moneyline: {
        home: outcomeFor(h2h, homeTeam)?.price ?? 0,
        away: outcomeFor(h2h, awayTeam)?.price ?? 0,
      },
      spread: {
        home: homeSpread?.point ?? 0,
        away: awaySpread?.point ?? 0,
        homeOdds: homeSpread?.price ?? -110,
        awayOdds: awaySpread?.price ?? -110,
      },
      total: {
        line: over?.point ?? under?.point ?? 0,
        over: over?.price ?? -110,
        under: under?.price ?? -110,
      },
    };
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportParam = searchParams.get('sport') as SportKey | null;
    const gameId = searchParams.get('gameId');
    const apiKey = process.env.ODDS_API_KEY;

    const sport =
      (sportParam && SPORTS[sportParam] ? sportParam : null) ??
      (gameId ? sportFromGameId(gameId) : null);

    if (apiKey && !apiKey.startsWith('placeholder') && sport) {
      const cfg = SPORTS[sport];
      const cacheKey = `odds-${sport}-${gameId ?? 'all'}`;
      const cached = getCached<Book[]>(cacheKey);
      if (cached) return NextResponse.json({ odds: cached });

      try {
        // A specific game was asked for, so resolve its teams and keep only that
        // matchup's books — previously every event's books were merged into one
        // list, so a single game's page showed the whole slate's odds.
        let target: { homeTeam: string; awayTeam: string } | null = null;
        if (gameId) {
          const games = await fetchESPNGames(sport);
          target = games.find((g) => g.id === gameId) ?? null;
          if (!target) {
            return NextResponse.json({ odds: getMockOdds(gameId) });
          }
        }

        const url = `https://api.the-odds-api.com/v4/sports/${cfg.oddsApiKey}/odds?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;
        const res = await fetch(url);
        if (res.ok) {
          const events = (await res.json()) ?? [];

          let books: Book[];
          if (target) {
            const match = events.find(
              (e: any) =>
                nickname(String(e?.home_team ?? '')) === nickname(target!.homeTeam) &&
                nickname(String(e?.away_team ?? '')) === nickname(target!.awayTeam)
            );
            if (!match) return NextResponse.json({ odds: getMockOdds(gameId!) });
            books = toBooks(match, target.homeTeam, target.awayTeam);
          } else {
            books = events.flatMap((e: any) =>
              toBooks(e, String(e?.home_team ?? ''), String(e?.away_team ?? ''))
            );
          }

          setCache(cacheKey, books, ODDS_CACHE_TTL);
          return NextResponse.json({ odds: books });
        }
      } catch (err: any) {
        console.error('Odds API error:', err?.message);
      }
    }

    return NextResponse.json({ odds: getMockOdds(gameId ?? 'default') });
  } catch (error: any) {
    console.error('Odds route error:', error);
    return NextResponse.json({ odds: getMockOdds('default') });
  }
}
