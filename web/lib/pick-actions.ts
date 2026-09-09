import { toast } from 'sonner';
import { useParlayStore } from '@/lib/parlay-store';

/** The shape both the dashboard picks and the props list render. */
export interface PickLike {
  id: string;
  playerName: string;
  team: string;
  sport: string;
  statType: string;
  line: number;
  odds: number;
  recommendation: string;
}

export function describePick(pick: PickLike): string {
  return `${pick.playerName} ${pick.recommendation} ${pick.line} ${pick.statType}`.replace(/\s+/g, ' ').trim();
}

/** Persists the pick to the signed-in user's tracker. */
export async function savePickToTracker(pick: PickLike): Promise<void> {
  try {
    const res = await fetch('/api/user/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sport: pick.sport,
        league: pick.sport?.toUpperCase() ?? '',
        marketType: 'PROP',
        description: describePick(pick),
        selection: pick.recommendation,
        odds: pick.odds,
      }),
    });
    if (res.ok) {
      toast.success('Pick saved to tracker');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? 'Failed to save pick');
    }
  } catch {
    toast.error('Failed to save pick');
  }
}

/** Adds the pick to the shared parlay slip read by the parlay builder. */
export function addPickToParlay(pick: PickLike): void {
  const added = useParlayStore.getState().addLeg({
    id: pick.id,
    description: describePick(pick),
    odds: pick.odds,
    sport: pick.sport,
  });
  toast[added ? 'success' : 'info'](
    added ? 'Added to your parlay slip' : 'Already in your parlay slip'
  );
}
