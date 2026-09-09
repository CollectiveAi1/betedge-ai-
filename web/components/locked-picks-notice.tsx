'use client';
import Link from 'next/link';
import { Lock, Zap } from 'lucide-react';

/**
 * Shown when the API withheld results because of the caller's tier. The withheld
 * picks are never sent to the browser, so there is nothing to blur — this states
 * plainly how many are held back and links to the upgrade page.
 */
export function LockedPicksNotice({ hidden, noun = 'pick' }: { hidden: number; noun?: string }) {
  if (hidden <= 0) return null;
  // "1 more picks" reads as a bug to anyone who sees it.
  const plural = hidden === 1 ? noun : `${noun}s`;
  return (
    <div className="col-span-full bg-card rounded-xl border border-dashed border-primary/40 p-6 text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
        <Lock className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground text-lg mb-1">
        {hidden} more {plural} available on Pro
      </h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
        Your plan shows a limited daily slate. Upgrade for the full board plus key
        factors and risk analysis on every pick.
      </p>
      <Link
        href="/upgrade"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Zap className="h-4 w-4" /> Upgrade to Pro
      </Link>
    </div>
  );
}
