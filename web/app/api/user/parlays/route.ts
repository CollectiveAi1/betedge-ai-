export const dynamic = 'force-dynamic';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const parlays = await prisma.parlay.findMany({
      where: { userId: session.user.id },
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
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { legs, combinedOdds, name } = body ?? {};
    const parlay = await prisma.parlay.create({
      data: {
        userId: session.user.id,
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
