'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { GradeBadge } from '@/components/grade-badge';
import { PaywallGate } from '@/components/paywall-gate';
import { getTierLimits } from '@/lib/tier-limits';
import { Layers, Plus, X, Calculator, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ParlayLeg {
  id: string;
  description: string;
  odds: number;
  sport: string;
}

export function ParlayBuilderContent() {
  const { data: session } = useSession();
  const tier = (session?.user as any)?.subscriptionTier ?? 'FREE';
  const limits = getTierLimits(tier);

  const [legs, setLegs] = useState<ParlayLeg[]>([]);
  const [newDesc, setNewDesc] = useState('');
  const [newOdds, setNewOdds] = useState('');
  const [stake, setStake] = useState('10');
  const [saving, setSaving] = useState(false);

  function addLeg() {
    if (!newDesc || !newOdds) {
      toast.error('Enter a description and odds.');
      return;
    }
    if (legs.length >= limits.maxParlayLegs) {
      toast.error(`Free tier limited to ${limits.maxParlayLegs} legs. Upgrade for more.`);
      return;
    }
    const leg: ParlayLeg = {
      id: `leg-${Date.now()}`,
      description: newDesc,
      odds: parseInt(newOdds) || -110,
      sport: 'multi',
    };
    setLegs([...legs, leg]);
    setNewDesc('');
    setNewOdds('');
  }

  function removeLeg(id: string) {
    setLegs(legs.filter((l: ParlayLeg) => l.id !== id));
  }

  function americanToDecimal(american: number): number {
    if (american > 0) return (american / 100) + 1;
    return (100 / Math.abs(american)) + 1;
  }

  const combinedDecimal = (legs ?? []).reduce((acc: number, l: ParlayLeg) => acc * americanToDecimal(l.odds), 1);
  const combinedAmerican = combinedDecimal >= 2 ? Math.round((combinedDecimal - 1) * 100) : Math.round(-100 / (combinedDecimal - 1));
  const stakeNum = parseFloat(stake) || 0;
  const payout = stakeNum * combinedDecimal;

  async function saveParlay() {
    if (legs.length === 0) {
      toast.error('Add at least one leg.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/user/parlays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legs,
          combinedOdds: combinedAmerican,
        }),
      });
      if (res.ok) {
        toast.success('Parlay saved!');
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Error saving parlay');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Parlay Builder
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Build custom parlays, get AI grades, and calculate payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add leg form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-xl p-4 border border-border/50" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="font-semibold text-foreground mb-3">Add a Leg</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="e.g. Patrick Mahomes Over 275.5 Pass Yards"
                  value={newDesc}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDesc(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Odds (e.g. -110)"
                  value={newOdds}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOdds(e.target.value)}
                  className="w-full sm:w-32"
                  type="number"
                />
                <Button onClick={addLeg}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>

            {/* Legs list */}
            <PaywallGate isLocked={tier === 'FREE' && legs.length > limits.maxParlayLegs} message="Free tier allows 2 parlay legs. Upgrade for unlimited.">
              <div className="space-y-2">
                <AnimatePresence>
                  {(legs ?? []).map((leg: ParlayLeg, i: number) => (
                    <motion.div
                      key={leg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-card rounded-xl p-4 border border-border/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                          #{i + 1}
                        </span>
                        <div>
                          <span className="text-sm font-medium text-foreground">{leg.description}</span>
                          <span className="block text-xs font-mono text-muted-foreground">
                            {leg.odds > 0 ? `+${leg.odds}` : leg.odds}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLeg(leg.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </PaywallGate>

            {legs.length === 0 && (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No legs added yet. Add your first pick above.</p>
              </div>
            )}
          </div>

          {/* Summary panel */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-4 border border-border/50 sticky top-20" style={{ boxShadow: 'var(--shadow-md)' }}>
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" /> Payout Calculator
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Legs</span>
                  <span className="font-mono text-foreground">{legs.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Combined Odds</span>
                  <span className="font-mono font-bold text-primary">
                    {legs.length > 0 ? (combinedAmerican > 0 ? `+${combinedAmerican}` : combinedAmerican) : '—'}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Stake ($)</label>
                  <Input
                    type="number"
                    value={stake}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStake(e.target.value)}
                  />
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Potential Payout</span>
                    <span className="text-lg font-bold font-mono text-primary">
                      ${legs.length > 0 ? payout.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveParlay} loading={saving} className="flex-1" disabled={legs.length === 0}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                  <Button variant="outline" onClick={() => setLegs([])} disabled={legs.length === 0}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
