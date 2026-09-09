'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { Zap, CheckCircle, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const PLANS = [
  {
    id: 'pro-monthly',
    name: 'Pro',
    price: '$9.99',
    period: 'month',
    annualPrice: '$7.99/mo',
    annualBilling: 'billed annually',
    features: [
      'Unlimited picks & props',
      'Full AI analysis (key factors + risks)',
      'Odds from up to 5 books',
      'Unlimited parlay legs + AI grade',
      'Line movement display',
      '3 alerts',
      'Full pick tracker with ROI',
      '7-day free trial',
    ],
    popular: true,
    icon: Zap,
  },
  {
    id: 'elite-monthly',
    name: 'Elite',
    price: '$19.99',
    period: 'month',
    annualPrice: '$15.99/mo',
    annualBilling: 'billed annually',
    features: [
      'Everything in Pro',
      'Odds from 10+ books',
      'Unlimited alerts',
      'Early access picks (2hr ahead)',
      'Full ROI analytics',
      'Backtesting dashboard',
      'Priority AI analysis refresh',
    ],
    popular: false,
    icon: Crown,
  },
];

export function UpgradeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const tier = session?.user?.subscriptionTier ?? 'FREE';
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  async function handleSubscribe(planId: string) {
    // Checkout requires a session; sending an anonymous visitor to sign up first is
    // clearer than surfacing the API's 401.
    if (status !== 'authenticated') {
      router.push(`/signup?next=${encodeURIComponent('/upgrade')}`);
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingCycle }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        toast.error(data?.error ?? 'Unable to start checkout');
      }
    } catch {
      toast.error('Error starting checkout');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Upgrade Your Edge</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight mb-2">
            Unlock the full power of BetEdge AI
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get unlimited analysis, cross-book odds, and advanced tools. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'annual' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              Annual <span className="text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map((plan: typeof PLANS[number], i: number) => {
            const Icon = plan.icon;
            const isCurrent = (tier === 'PRO' && plan.id?.startsWith('pro')) || (tier === 'ELITE' && plan.id?.startsWith('elite'));
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card rounded-xl p-6 border ${
                  plan.popular ? 'border-primary shadow-lg shadow-primary/10 relative' : 'border-border/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl font-bold text-foreground">{plan.name}</h2>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold font-mono text-foreground">
                    {billingCycle === 'annual' ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-xs text-primary mb-4">{plan.annualBilling}</p>
                )}
                {billingCycle !== 'annual' && <div className="mb-4" />}

                <ul className="space-y-2 mb-6">
                  {(plan.features ?? []).map((f: string, j: number) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  loading={loadingPlan === plan.id}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Current Plan' : `Get ${plan.name}`}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
