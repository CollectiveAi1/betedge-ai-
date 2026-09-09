'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Gamepad2,
  Target,
  Layers,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Picks', icon: LayoutDashboard },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/props', label: 'Props', icon: Target },
  { href: '/parlay-builder', label: 'Parlay', icon: Layers },
  { href: '/tracker', label: 'Tracker', icon: ClipboardList },
  { href: '/alerts', label: 'Alerts', icon: Bell },
];

export function AppHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const tier = session?.user?.subscriptionTier ?? 'FREE';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href={session ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight hidden sm:block">
            BetEdge <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {session && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item: typeof NAV_ITEMS[number]) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              {tier === 'FREE' && (
                <Link
                  href="/upgrade"
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Zap className="h-3 w-3" /> Upgrade
                </Link>
              )}
              {tier !== 'FREE' && (
                <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-primary/20 text-primary">
                  {tier}
                </span>
              )}

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">{session?.user?.name ?? session?.user?.email?.split('@')?.[0] ?? 'User'}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <User className="h-4 w-4" /> Account
                    </Link>
                    <button
                      onClick={() => signOut({ redirectTo: '/' })}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {session && mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-4 py-2 space-y-1">
            {NAV_ITEMS.map((item: typeof NAV_ITEMS[number]) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
