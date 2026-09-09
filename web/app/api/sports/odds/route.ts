export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCached, setCache, ODDS_CACHE_TTL } from '@/lib/cache';
import { SPORTS, type SportKey } from '@/lib/sports-config';
import { getMockOdds } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportParam = searchParams.get('sport') as SportKey | null;
    const gameId = searchParams.get('gameId');
    const apiKey = process.env.ODDS_API_KEY;

    // Try Odds API if key is configured and not placeholder
    if (apiKey && !apiKey.startsWith('placeholder') && sportParam) {
      const cfg = SPORTS[sportParam];
      if (cfg) {
        const cacheKey = `odds-${sportParam}-${gameId ?? 'all'}`;
        const cached = getCached<any[]>(cacheKey);
        if (cached) return NextResponse.json({ odds: cached });

        try {
          const url = `https://api.the-odds-api.com/v4/sports/${cfg.oddsApiKey}/odds?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            const formattedOdds = (data ?? []).flatMap((event: any) =>
              (event?.bookmakers ?? []).map((bm: any) => {
                const h2h = bm?.markets?.find((m: any) => m?.key === 'h2h');
                const spreads = bm?.markets?.find((m: any) => m?.key === 'spreads');
                const totals = bm?.markets?.find((m: any) => m?.key === 'totals');
                return {
                  bookmaker: bm?.title ?? 'Unknown',
                  moneyline: {
                    home: h2h?.outcomes?.[0]?.price ?? 0,
                    away: h2h?.outcomes?.[1]?.price ?? 0,
                  },
                  spread: {
                    home: spreads?.outcomes?.[0]?.point ?? 0,
                    away: spreads?.outcomes?.[1]?.point ?? 0,
                    homeOdds: spreads?.outcomes?.[0]?.price ?? -110,
                    awayOdds: spreads?.outcomes?.[1]?.price ?? -110,
                  },
                  total: {
                    line: totals?.outcomes?.[0]?.point ?? 0,
                    over: totals?.outcomes?.[0]?.price ?? -110,
                    under: totals?.outcomes?.[1]?.price ?? -110,
                  },
                };
              })
            );
            setCache(cacheKey, formattedOdds, ODDS_CACHE_TTL);
            return NextResponse.json({ odds: formattedOdds });
          }
        } catch (err: any) {
          console.error('Odds API error:', err?.message);
        }
      }
    }

    // Fallback to mock
    const mockOdds = getMockOdds(gameId ?? 'default');
    return NextResponse.json({ odds: mockOdds });
  } catch (error: any) {
    console.error('Odds route error:', error);
    return NextResponse.json({ odds: getMockOdds('default') });
  }
}
