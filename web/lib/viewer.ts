import { requireUserId } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { getTierLimits, type TierLimits } from '@/lib/tier-limits';

/**
 * The caller's subscription tier and the limits that go with it. Falls back to FREE
 * for anonymous callers, so route handlers can gate content without branching on
 * whether anyone is signed in.
 */
export async function getViewerLimits(request: Request): Promise<{ tier: string; limits: TierLimits }> {
  const userId = await requireUserId(request);
  if (!userId) return { tier: 'FREE', limits: getTierLimits('FREE') };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });
  const tier = user?.subscriptionTier ?? 'FREE';
  return { tier, limits: getTierLimits(tier) };
}
