export const dynamic = 'force-dynamic';
import { requireUserId } from '@/lib/api-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const { result } = body ?? {};
    if (!['WIN', 'LOSS', 'PUSH', 'PENDING'].includes(result)) {
      return NextResponse.json({ error: 'Invalid result' }, { status: 400 });
    }
    // Scoped by userId so one user cannot grade another user's pick; a zero count
    // means the pick does not exist or is not theirs.
    const { count } = await prisma.userPick.updateMany({
      where: { id, userId: userId },
      data: { result },
    });
    if (count === 0) {
      return NextResponse.json({ error: 'Pick not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update pick error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
