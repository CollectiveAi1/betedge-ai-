'use client';
import { Lock, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaywallGateProps {
  children: React.ReactNode;
  isLocked: boolean;
  message?: string;
}

export function PaywallGate({ children, isLocked, message }: PaywallGateProps) {
  const router = useRouter();

  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="paywall-blur">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
        <div className="flex flex-col items-center gap-3 text-center p-6">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-lg">Premium Content</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {message ?? 'Upgrade to Pro to unlock full AI analysis, unlimited picks, and more.'}
          </p>
          <Button
            onClick={() => router.push('/upgrade')}
            className="mt-2"
          >
            <Zap className="h-4 w-4 mr-1" /> Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
