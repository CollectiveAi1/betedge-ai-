'use client';
import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AppFooter() {
  const [year, setYear] = useState(2026);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer className="border-t border-border/50 bg-background/80">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              BetEdge AI © {year}
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-md">
            Powered by educational analysis only — 21+ | Gamble Responsibly.
            This tool does not guarantee wins. Please bet within your means.
          </p>
        </div>
      </div>
    </footer>
  );
}
