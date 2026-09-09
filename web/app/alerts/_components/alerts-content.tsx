'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { PaywallGate } from '@/components/paywall-gate';
import { getTierLimits } from '@/lib/tier-limits';
import { Bell, Plus, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AlertItem {
  id: string;
  alertType: string;
  marketDescription: string;
  threshold: number | null;
  isActive: boolean;
  createdAt: string;
}

export function AlertsContent() {
  const { data: session } = useSession();
  const tier = (session?.user as any)?.subscriptionTier ?? 'FREE';
  const limits = getTierLimits(tier);

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('LINE_MOVEMENT');
  const [saving, setSaving] = useState(false);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/alerts');
      const data = await res.json().catch(() => ({}));
      setAlerts(data?.alerts ?? []);
    } catch { setAlerts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAlerts(); }, [loadAlerts]);

  async function createAlert() {
    if (!newDesc) { toast.error('Enter a market description.'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/user/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertType: newType, marketDescription: newDesc }),
      });
      if (res.ok) {
        toast.success('Alert created!');
        setNewDesc('');
        loadAlerts();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error ?? 'Failed to create alert');
      }
    } catch { toast.error('Error'); }
    finally { setSaving(false); }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Alerts
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Set line movement or injury alerts for picks you&apos;re watching.
          </p>
        </div>

        <PaywallGate isLocked={!limits.alertsEnabled} message="Alerts are a premium feature. Upgrade to Pro to set line movement and injury alerts.">
          {/* Create alert */}
          <div className="bg-card rounded-xl p-4 border border-border/50 mb-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-semibold text-foreground mb-3">New Alert</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={newType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewType(e.target.value)}
                className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm border border-border"
              >
                <option value="LINE_MOVEMENT">Line Movement</option>
                <option value="INJURY">Injury News</option>
              </select>
              <Input
                placeholder="e.g. Patrick Mahomes Pass Yards O 275.5"
                value={newDesc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDesc(e.target.value)}
                className="flex-1"
              />
              <Button onClick={createAlert} loading={saving}>
                <Plus className="h-4 w-4 mr-1" /> Add Alert
              </Button>
            </div>
          </div>

          {/* Alert list */}
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 2 }).map((_: unknown, i: number) => (
                <div key={i} className="h-14 bg-secondary rounded-xl animate-pulse" />
              ))
            ) : (alerts ?? []).length > 0 ? (
              (alerts ?? []).map((alert: AlertItem, i: number) => (
                <motion.div
                  key={alert?.id ?? i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl p-4 border border-border/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {alert?.alertType === 'LINE_MOVEMENT' ? (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">{alert?.marketDescription ?? ''}</div>
                      <div className="text-xs text-muted-foreground">{alert?.alertType?.replace('_', ' ') ?? ''}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${alert?.isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {alert?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No alerts yet</h3>
                <p className="text-sm text-muted-foreground">Create your first alert above.</p>
              </div>
            )}
          </div>
        </PaywallGate>
      </main>
      <AppFooter />
    </div>
  );
}
