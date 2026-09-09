export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getMockProps } from '@/lib/mock-data';
import type { SportKey } from '@/lib/sports-config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportParam = searchParams.get('sport') as SportKey | null;

    let props = getMockProps(sportParam ?? undefined);

    // Transform mock props to pick format
    const picks = (props ?? []).map((p: any) => ({
      id: p?.id ?? '',
      playerName: p?.playerName ?? 'Unknown',
      team: p?.team ?? '',
      sport: p?.sport ?? 'nfl',
      statType: p?.statType ?? '',
      line: p?.line ?? 0,
      odds: p?.overOdds ?? -110,
      grade: p?.grade ?? 'C',
      confidence: p?.confidence ?? 50,
      recommendation: p?.recommendation ?? 'N/A',
      edgeSummary: p?.edgeSummary ?? '',
    }));

    return NextResponse.json({ picks });
  } catch (error: any) {
    console.error('Dashboard picks error:', error);
    return NextResponse.json({ picks: [] });
  }
}
