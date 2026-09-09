'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  Layers,
  Zap,
  Target,
  Trophy,
  CheckCircle,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { GradeBadge } from '@/components/grade-badge';
import { MOCK_PROPS } from '@/lib/mock-data';

const FEATURES = [
  { icon: TrendingUp, title: 'AI-Graded Picks', desc: 'Every pick analyzed with A-F confidence grades, key factors, and risk assessment.' },
  { icon: BarChart3, title: 'Cross-Book Odds', desc: 'Compare odds from 10+ sportsbooks side-by-side. Never leave money on the table.' },
  { icon: Target, title: 'Player Props', desc: 'Deep analysis on player props with matchup data, trends, and hit rates.' },
  { icon: Layers, title: 'Parlay Builder', desc: 'Build smarter parlays with AI grading on every combination.' },
  { icon: Trophy, title: '5 Sports Coverage', desc: 'NFL, NBA, MLB, NCAAF, and NCAAB — all major sports covered.' },
  { icon: Zap, title: 'Real-Time Alerts', desc: 'Get notified on line movement, injury news, and sharp money shifts.' },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['5 AI picks per day', '5 prop views per day', 'Basic odds display', 'Last 10 picks tracker', '2-leg parlays'],
    cta: 'Get Started',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    annual: '$7.99/mo billed annually',
    features: ['Unlimited picks & props', 'Full AI analysis', '5-book odds comparison', 'Unlimited parlays', 'Line movement display', '3 alerts', 'Full pick tracker with ROI'],
    cta: 'Start 7-Day Free Trial',
    href: '/signup',
    popular: true,
  },
  {
    name: 'Elite',
    price: '$19.99',
    period: '/month',
    annual: '$15.99/mo billed annually',
    features: ['Everything in Pro', '10+ book odds comparison', 'Unlimited alerts', 'Early access picks', 'Full ROI analytics', 'Backtesting dashboard', 'Priority AI refresh'],
    cta: 'Go Elite',
    href: '/signup',
    popular: false,
  },
];

export function LandingPage() {
  const samplePicks = (MOCK_PROPS ?? []).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Sports Research</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
              Compare the market.<br />
              <span className="text-primary">Find your edge.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              AI-graded picks, cross-book odds comparison, and deep prop analysis
              across NFL, NBA, MLB, and NCAA. Make smarter betting decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8">
                  <Zap className="h-5 w-5 mr-1" /> Start Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Log In <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sample picks */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {samplePicks.map((pick: typeof samplePicks[number], i: number) => (
            <motion.div
              key={pick?.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 border border-border/50"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <GradeBadge grade={pick?.grade ?? 'C'} confidence={pick?.confidence ?? 0} />
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {pick?.recommendation ?? ''}
                </span>
              </div>
              <div className="font-semibold text-foreground mb-1">
                {pick?.playerName ?? 'Player'} — {pick?.statType ?? 'Stat'}
              </div>
              <div className="text-sm text-muted-foreground font-mono mb-2">
                Line: {pick?.line ?? 0} | Odds: {(pick?.overOdds ?? 0) > 0 ? '+' : ''}{pick?.overOdds ?? 0}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {pick?.edgeSummary ?? ''}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-card/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground tracking-tight mb-3">
              Everything you need to find <span className="text-primary">your edge</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional-grade tools built for smart bettors. Research faster, bet smarter.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f: typeof FEATURES[number], i: number) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground tracking-tight mb-3">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING.map((plan: typeof PRICING[number], i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`bg-card rounded-xl p-6 border ${
                  plan.popular
                    ? 'border-primary shadow-lg shadow-primary/10 relative'
                    : 'border-border/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold font-mono text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                {plan.annual && (
                  <p className="text-xs text-primary mb-4">{plan.annual}</p>
                )}
                {!plan.annual && <div className="mb-4" />}
                <ul className="space-y-2 mb-6">
                  {(plan.features ?? []).map((f: string, j: number) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
