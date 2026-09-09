export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { SPORTS, type SportKey, SPORT_KEYS } from '@/lib/sports-config';
import { fetchESPNGames, sportFromGameId, type Game } from '@/lib/espn';
import { getMockGames } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportParam = searchParams.get('sport') as SportKey | null;
    const gameId = searchParams.get('gameId');
    // `date` selects the slate: today (default) or tomorrow. Previously it was
    // accepted by callers but never read, so a "tomorrow" request returned today.
    const offsetDays = searchParams.get('date') === 'tomorrow' ? 1 : 0;

    let allGames: Game[] = [];

    // A game id carries its own sport, so a lookup by id never has to fan out
    // across every league.
    const sport = (sportParam && SPORTS[sportParam] ? sportParam : null) ?? (gameId ? sportFromGameId(gameId) : null);

    if (sport) {
      allGames = await fetchESPNGames(sport, offsetDays);
    } else {
      const results = await Promise.all(SPORT_KEYS.map((k: SportKey) => fetchESPNGames(k, offsetDays)));
      allGames = results.flat();
    }

    // Fallback to mock if empty
    if (allGames.length === 0) {
      allGames = getMockGames(sport ?? undefined);
    }

    if (gameId) {
      const game = allGames.find((g) => g.id === gameId);
      return NextResponse.json({ game: game ?? null, games: game ? [game] : [] });
    }

    return NextResponse.json({ games: allGames });
  } catch (error: any) {
    console.error('Games API error:', error);
    return NextResponse.json({ games: getMockGames() });
  }
}
