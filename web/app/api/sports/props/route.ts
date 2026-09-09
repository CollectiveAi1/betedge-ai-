export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getMockProps } from '@/lib/mock-data';
import type { SportKey } from '@/lib/sports-config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportParam = searchParams.get('sport') as SportKey | null;
    const searchQuery = searchParams.get('search');
    const propId = searchParams.get('propId');
    const gameId = searchParams.get('gameId');

    let props = getMockProps(sportParam ?? undefined);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      props = props.filter((p: any) =>
        (p?.playerName ?? '').toLowerCase().includes(q) ||
        (p?.team ?? '').toLowerCase().includes(q) ||
        (p?.statType ?? '').toLowerCase().includes(q)
      );
    }

    if (propId) {
      const prop = props.find((p: any) => p?.id === propId);
      return NextResponse.json({ prop: prop ?? null, props: prop ? [prop] : [] });
    }

    if (gameId) {
      // Filter props related to this game's sport
      const sportFromGame = gameId?.split('-')?.[0] as SportKey | undefined;
      if (sportFromGame) {
        props = props.filter((p: any) => p?.sport === sportFromGame);
      }
    }

    return NextResponse.json({ props });
  } catch (error: any) {
    console.error('Props API error:', error);
    return NextResponse.json({ props: getMockProps() });
  }
}
