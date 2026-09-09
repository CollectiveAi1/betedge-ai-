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
    const parlays = await prisma.parlay.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ parlays });
  } catch (error: any) {
    console.error('Get parlays error:', error);
    return NextResponse.json({ parlays: [] });
  }
}

export async function POST(request: Request) {
  const userId = await requireUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { legs, combinedOdds, name } = body ?? {};
    const parlay = await prisma.parlay.create({
      data: {
        userId,
        legs: legs ?? [],
        combinedOdds: combinedOdds ?? 0,
        name: name ?? 'My Parlay',
      },
    });
    return NextResponse.json({ parlay }, { status: 201 });
  } catch (error: any) {
    console.error('Create parlay error:', error);
    return NextResponse.json({ error: 'Failed to save parlay' }, { status: 500 });
  }
}
