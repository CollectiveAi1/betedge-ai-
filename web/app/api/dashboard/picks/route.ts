export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getMockProps } from '@/lib/mock-data';
import { getViewerLimits } from '@/lib/viewer';
import type { SportKey } from '@/lib/sports-config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportParam = searchParams.get('sport') as SportKey | null;

    const props = getMockProps(sportParam ?? undefined);
    const { limits } = await getViewerLimits(request);

    // Transform mock props to pick format
    const allPicks = (props ?? []).map((p: any) => ({
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
      // Free tier does not get the full research packet.
      ...(limits.showFullAnalysis
        ? { keyFactors: p?.keyFactors ?? [], risks: p?.risks ?? [] }
        : {}),
    }));

    // Enforced here as well as in the UI: hiding the extra picks behind a blur in
    // the browser still ships them over the wire, so a free account could read every
    // pick straight out of the network response.
    const picks = allPicks.slice(0, limits.dailyPicks);

    return NextResponse.json({ picks, total: allPicks.length, limit: limits.dailyPicks });
  } catch (error: any) {
    console.error('Dashboard picks error:', error);
    return NextResponse.json({ picks: [] });
  }
}
