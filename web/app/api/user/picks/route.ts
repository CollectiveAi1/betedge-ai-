export const dynamic = 'force-dynamic';
import { requireUserId } from '@/lib/api-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const userId = await requireUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const picks = await prisma.userPick.findMany({
      where: { userId },
      orderBy: { pickedAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ picks });
  } catch (error: any) {
    console.error('Get picks error:', error);
    return NextResponse.json({ picks: [] });
  }
}

export async function POST(request: Request) {
  const userId = await requireUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { sport, league, marketType, description, selection, odds } = body ?? {};
    const pick = await prisma.userPick.create({
      data: {
        userId,
        sport: sport ?? '',
        league: league ?? '',
        marketType: marketType ?? 'PROP',
        description: description ?? '',
        selection: selection ?? '',
        odds: odds ?? -110,
      },
    });
    return NextResponse.json({ pick }, { status: 201 });
  } catch (error: any) {
    console.error('Create pick error:', error);
    return NextResponse.json({ error: 'Failed to save pick' }, { status: 500 });
  }
}
