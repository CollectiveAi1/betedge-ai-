export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getMockProps } from '@/lib/mock-data';
import { getViewerLimits } from '@/lib/viewer';
import type { SportKey } from '@/lib/sports-config';

const PAID_ANALYSIS_FIELDS = ['keyFactors', 'risks'] as const;

/** Key factors and risks are the paid part of the research packet. */
function redact(prop: any, showFullAnalysis: boolean) {
  if (showFullAnalysis) return prop;
  const rest = { ...(prop ?? {}) };
  for (const field of PAID_ANALYSIS_FIELDS) delete rest[field];
  return rest;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportParam = searchParams.get('sport') as SportKey | null;
    const searchQuery = searchParams.get('search');
    const propId = searchParams.get('propId');
    const gameId = searchParams.get('gameId');

    const { limits } = await getViewerLimits(request);
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
      const found = props.find((p: any) => p?.id === propId);
      const prop = found ? redact(found, limits.showFullAnalysis) : null;
      return NextResponse.json({ prop, props: prop ? [prop] : [] });
    }

    if (gameId) {
      // Filter props related to this game's sport
      const sportFromGame = gameId?.split('-')?.[0] as SportKey | undefined;
      if (sportFromGame) {
        props = props.filter((p: any) => p?.sport === sportFromGame);
      }
    }

    const visible = props.slice(0, limits.dailyProps).map((p: any) => redact(p, limits.showFullAnalysis));
    return NextResponse.json({ props: visible, total: props.length, limit: limits.dailyProps });
  } catch (error: any) {
    console.error('Props API error:', error);
    return NextResponse.json({ props: [] }, { status: 500 });
  }
}
