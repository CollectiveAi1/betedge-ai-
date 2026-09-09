'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { PaywallGate } from '@/components/paywall-gate';
import { getTierLimits } from '@/lib/tier-limits';
import { ClipboardList, Check, X as XIcon, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Pick {
  id: string;
  sport: string;
  description: string;
  selection: string;
  odds: number;
  result: string;
  pickedAt: string;
}

export function TrackerContent() {
  const { data: session } = useSession();
  const tier = session?.user?.subscriptionTier ?? 'FREE';
  const limits = getTierLimits(tier);

  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPicks = useCallback(async () => {
    try {
      const res = await fetch('/api/user/picks');
      const data = await res.json().catch(() => ({}));
      setPicks(data?.picks ?? []);
    } catch { setPicks([]); }
    finally { setLoading(false); }
  }, []);

  // Fires once on mount; `loading` already starts true, so the loader does
  // not have to raise it synchronously from inside the effect.
  useEffect(() => {
    void loadPicks();
  }, [loadPicks]);

  async function updateResult(pickId: string, result: string) {
    try {
      const res = await fetch(`/api/user/picks/${pickId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      });
      if (res.ok) {
        toast.success(`Pick marked as ${result}`);
        loadPicks();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error ?? 'Failed to update');
      }
    } catch { toast.error('Failed to update'); }
  }

  const wins = (picks ?? []).filter((p: Pick) => p?.result === 'WIN').length;
  const losses = (picks ?? []).filter((p: Pick) => p?.result === 'LOSS').length;
  const total = wins + losses;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

  // Calculate ROI
  const roi = (picks ?? []).reduce((acc: number, p: Pick) => {
    if (p?.result === 'WIN') {
      const profit = (p.odds ?? 0) > 0 ? (p.odds / 100) : (100 / Math.abs(p.odds || 1));
      return acc + profit;
    } else if (p?.result === 'LOSS') {
      return acc - 1;
    }
    return acc;
  }, 0);

  const displayPicks = limits.fullTracker ? picks : (picks ?? []).slice(0, 10);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Pick Tracker
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">Track your picks, mark results, and monitor your performance.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Total</div>
            <div className="text-lg font-bold font-mono text-foreground">{picks?.length ?? 0}</div>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Wins</div>
            <div className="text-lg font-bold font-mono text-primary">{wins}</div>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Win Rate</div>
            <div className="text-lg font-bold font-mono text-foreground">{winRate}%</div>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">ROI</div>
            <div className={`text-lg font-bold font-mono ${roi >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {roi >= 0 ? '+' : ''}{roi.toFixed(2)}u
            </div>
          </div>
        </div>

        <PaywallGate isLocked={!limits.fullTracker && (picks?.length ?? 0) > 10} message="Upgrade to Pro for full pick tracking with ROI analytics.">
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_: unknown, i: number) => (
                <div key={i} className="h-16 bg-secondary rounded-xl animate-pulse" />
              ))
            ) : (displayPicks ?? []).length > 0 ? (
              (displayPicks ?? []).map((pick: Pick, i: number) => (
                <motion.div
                  key={pick?.id ?? i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-card rounded-xl p-4 border border-border/50 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">{pick?.description ?? ''}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {pick?.sport?.toUpperCase() ?? ''} · {pick?.selection ?? ''} · {(pick?.odds ?? 0) > 0 ? '+' : ''}{pick?.odds ?? 0}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pick?.result === 'PENDING' ? (
                      <>
                        <Button size="xs" variant="outline" onClick={() => updateResult(pick.id, 'WIN')} className="text-primary border-primary/30">
                          <Check className="h-3 w-3" /> W
                        </Button>
                        <Button size="xs" variant="outline" onClick={() => updateResult(pick.id, 'LOSS')} className="text-destructive border-destructive/30">
                          <XIcon className="h-3 w-3" /> L
                        </Button>
                        <Button size="xs" variant="outline" onClick={() => updateResult(pick.id, 'PUSH')}>
                          <Minus className="h-3 w-3" /> P
                        </Button>
                      </>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        pick?.result === 'WIN' ? 'bg-primary/20 text-primary' :
                        pick?.result === 'LOSS' ? 'bg-destructive/20 text-destructive' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {pick?.result ?? 'PENDING'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No picks yet</h3>
                <p className="text-sm text-muted-foreground">Save picks from the dashboard to start tracking.</p>
              </div>
            )}
          </div>
        </PaywallGate>
      </main>
      <AppFooter />
    </div>
  );
}
