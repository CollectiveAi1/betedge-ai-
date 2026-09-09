'use client';
import { useSession, signOut } from 'next-auth/react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { User, Mail, Shield, Crown, LogOut, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';

export function AccountContent() {
  const { data: session } = useSession();
  const tier = (session?.user as any)?.subscriptionTier ?? 'FREE';
  const [managingBilling, setManagingBilling] = useState(false);

  async function handleManageBilling() {
    setManagingBilling(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        toast.error('Unable to open billing portal');
      }
    } catch {
      toast.error('Error opening billing portal');
    } finally {
      setManagingBilling(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Account Settings
            </h1>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile */}
          <div className="bg-card rounded-xl p-6 border border-border/50" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-semibold text-foreground mb-4">Profile</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm text-foreground">{session?.user?.name ?? 'Not set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm text-foreground" suppressHydrationWarning>{session?.user?.email ?? 'Not set'}</span>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-card rounded-xl p-6 border border-border/50" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-semibold text-foreground mb-4">Subscription</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                tier === 'ELITE' ? 'bg-amber-500/20 text-amber-400' :
                tier === 'PRO' ? 'bg-primary/20 text-primary' :
                'bg-muted text-muted-foreground'
              }`}>
                <Crown className="h-4 w-4 inline mr-1" />
                {tier} Plan
              </div>
            </div>
            <div className="flex gap-3">
              {tier === 'FREE' ? (
                <Link href="/upgrade">
                  <Button><Shield className="h-4 w-4 mr-1" /> Upgrade to Pro</Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={handleManageBilling} loading={managingBilling}>
                  <ExternalLink className="h-4 w-4 mr-1" /> Manage Billing
                </Button>
              )}
            </div>
          </div>

          {/* Sign out */}
          <Button
            variant="outline"
            className="text-destructive border-destructive/30"
            onClick={() => signOut({ redirectTo: '/' })}
          >
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
