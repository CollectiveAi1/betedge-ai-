export const dynamic = 'force-dynamic';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const { result } = body ?? {};
    if (!['WIN', 'LOSS', 'PUSH', 'PENDING'].includes(result)) {
      return NextResponse.json({ error: 'Invalid result' }, { status: 400 });
    }
    const pick = await prisma.userPick.updateMany({
      where: { id, userId: session.user.id },
      data: { result },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update pick error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
