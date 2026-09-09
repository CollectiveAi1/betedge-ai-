export type SubscriptionTier = 'FREE' | 'PRO' | 'ELITE';

export interface TierLimits {
  dailyPicks: number;
  dailyProps: number;
  maxParlayLegs: number;
  showFullAnalysis: boolean;
  maxBooks: number;
  alertsEnabled: boolean;
  maxAlerts: number;
  fullTracker: boolean;
  earlyAccess: boolean;
  lineMovement: boolean;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  FREE: {
    dailyPicks: 5,
    dailyProps: 5,
    maxParlayLegs: 2,
    showFullAnalysis: false,
    maxBooks: 1,
    alertsEnabled: false,
    maxAlerts: 0,
    fullTracker: false,
    earlyAccess: false,
    lineMovement: false,
  },
  PRO: {
    dailyPicks: 999,
    dailyProps: 999,
    maxParlayLegs: 15,
    showFullAnalysis: true,
    maxBooks: 5,
    alertsEnabled: true,
    maxAlerts: 3,
    fullTracker: true,
    earlyAccess: false,
    lineMovement: true,
  },
  ELITE: {
    dailyPicks: 999,
    dailyProps: 999,
    maxParlayLegs: 25,
    showFullAnalysis: true,
    maxBooks: 15,
    alertsEnabled: true,
    maxAlerts: 999,
    fullTracker: true,
    earlyAccess: true,
    lineMovement: true,
  },
};

export function getTierLimits(tier: string): TierLimits {
  return TIER_LIMITS[(tier ?? 'FREE') as SubscriptionTier] ?? TIER_LIMITS.FREE;
}

export function isPremium(tier: string): boolean {
  return tier === 'PRO' || tier === 'ELITE';
}
