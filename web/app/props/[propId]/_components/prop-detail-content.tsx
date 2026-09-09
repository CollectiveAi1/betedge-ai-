'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { GradeBadge } from '@/components/grade-badge';
import { TrendBar } from '@/components/trend-bar';
import { PaywallGate } from '@/components/paywall-gate';
import { getTierLimits } from '@/lib/tier-limits';
import { RECOMMENDATION_COLORS } from '@/lib/sports-config';
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PropDetailContentProps {
  propId: string;
}

export function PropDetailContent({ propId }: PropDetailContentProps) {
  const { data: session } = useSession();
  const tier = (session?.user as any)?.subscriptionTier ?? 'FREE';
  const limits = getTierLimits(tier);

  const [prop, setProp] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/sports/props?propId=${propId}`);
        const data = await res.json().catch(() => ({}));
        const p = data?.prop ?? data?.props?.[0] ?? null;
        setProp(p);
        if (p) {
          setAnalysis({
            grade: p.grade,
            confidence: p.confidence,
            recommendation: p.recommendation,
            edgeSummary: p.edgeSummary,
            keyFactors: p.keyFactors ?? [],
            risks: p.risks ?? [],
          });
        }
      } catch { /* keep empty */ }
      finally { setLoading(false); }
    }
    load();
  }, [propId]);

  const generateAnalysis = useCallback(async () => {
    if (!prop) return;
    setAnalyzing(true);
    setAnalysisProgress('Generating AI analysis...');
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marketType: 'PROP',
          playerName: prop.playerName,
          statType: prop.statType,
          line: prop.line,
          sport: prop.sport,
          contextData: {
            overOdds: prop.overOdds,
            underOdds: prop.underOdds,
            team: prop.team,
          },
        }),
      });

      const reader = res?.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let partialRead = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        partialRead += decoder.decode(value, { stream: true });
        const lines = partialRead.split('\n');
        partialRead = lines.pop() ?? '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') return;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed?.status === 'processing') {
                setAnalysisProgress(parsed?.message ?? 'Analyzing...');
              } else if (parsed?.status === 'completed') {
                setAnalysis(parsed?.result ?? null);
                setAnalyzing(false);
                return;
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  }, [prop]);

  const recColor = RECOMMENDATION_COLORS[analysis?.recommendation ?? ''] ?? '#6B7280';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <Link href="/props" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Props
        </Link>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-secondary rounded" />
            <div className="h-48 bg-secondary rounded-xl" />
          </div>
        ) : prop ? (
          <div className="space-y-6">
            {/* Header card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 border border-border/50"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <GradeBadge grade={analysis?.grade ?? prop?.grade ?? 'C'} confidence={analysis?.confidence ?? prop?.confidence} size="lg" />
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">{prop?.playerName ?? 'Player'}</h1>
                    <p className="text-sm text-muted-foreground">{prop?.team ?? ''} · {prop?.statType ?? ''}</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold"
                  style={{ backgroundColor: `${recColor}20`, color: recColor }}
                >
                  {analysis?.recommendation?.includes('OVER') ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {analysis?.recommendation ?? prop?.recommendation ?? 'N/A'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground">Line</div>
                  <div className="text-lg font-bold font-mono text-foreground">{prop?.line ?? 0}</div>
                </div>
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground">Over</div>
                  <div className="text-lg font-bold font-mono text-foreground">{(prop?.overOdds ?? 0) > 0 ? '+' : ''}{prop?.overOdds ?? 0}</div>
                </div>
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground">Under</div>
                  <div className="text-lg font-bold font-mono text-foreground">{(prop?.underOdds ?? 0) > 0 ? '+' : ''}{prop?.underOdds ?? 0}</div>
                </div>
              </div>
            </motion.div>

            {/* AI Analysis */}
            <PaywallGate isLocked={!limits.showFullAnalysis} message="Upgrade to Pro for full AI analysis, key factors, and risk assessment.">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl p-6 border border-border/50"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-foreground">AI Research Packet</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateAnalysis}
                    loading={analyzing}
                    disabled={analyzing}
                  >
                    {analyzing ? analysisProgress : 'Refresh Analysis'}
                  </Button>
                </div>

                {analysis ? (
                  <div className="space-y-4">
                    {/* Edge summary */}
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <p className="text-sm text-foreground font-medium">{analysis?.edgeSummary ?? ''}</p>
                    </div>

                    {/* Key factors */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                        <CheckCircle className="h-4 w-4 text-primary" /> Key Factors
                      </h3>
                      <ul className="space-y-1.5">
                        {(analysis?.keyFactors ?? []).map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-0.5">•</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risks */}
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-400" /> Risks
                      </h3>
                      <ul className="space-y-1.5">
                        {(analysis?.risks ?? []).map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-amber-400 mt-0.5">•</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Trend bar */}
                    <TrendBar hits={7} total={10} label="Last 10 Games Hit Rate" />

                    {/* Disclaimer */}
                    <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
                      <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        This is educational analysis only. Never guarantee wins. Please gamble responsibly.
                      </p>
                    </div>
                  </div>
                ) : analyzing ? (
                  <div className="flex items-center justify-center gap-2 py-8">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    <span className="text-sm text-muted-foreground">{analysisProgress}</span>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Click "Refresh Analysis" to generate a fresh AI research packet.</p>
                  </div>
                )}
              </motion.div>
            </PaywallGate>
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-foreground">Prop not found</h3>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
