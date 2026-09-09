export const dynamic = 'force-dynamic';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTierLimits } from '@/lib/tier-limits';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const alerts = await prisma.alert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ alerts });
  } catch (error: any) {
    console.error('Get alerts error:', error);
    return NextResponse.json({ alerts: [] });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    // Check tier limits
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { subscriptionTier: true } });
    const limits = getTierLimits(user?.subscriptionTier ?? 'FREE');
    if (!limits.alertsEnabled) {
      return NextResponse.json({ error: 'Alerts require a premium subscription' }, { status: 403 });
    }
    const existingCount = await prisma.alert.count({ where: { userId: session.user.id, isActive: true } });
    if (existingCount >= limits.maxAlerts) {
      return NextResponse.json({ error: `Alert limit reached (${limits.maxAlerts})` }, { status: 403 });
    }

    const body = await request.json();
    const { alertType, marketDescription, threshold } = body ?? {};
    const alert = await prisma.alert.create({
      data: {
        userId: session.user.id,
        alertType: alertType ?? 'LINE_MOVEMENT',
        marketDescription: marketDescription ?? '',
        threshold: threshold ?? null,
      },
    });
    return NextResponse.json({ alert }, { status: 201 });
  } catch (error: any) {
    console.error('Create alert error:', error);
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}
