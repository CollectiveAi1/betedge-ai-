'use client';
import { cn } from '@/lib/utils';

interface OddsRow {
  bookmaker: string;
  spread?: { home: number; away: number; homeOdds: number; awayOdds: number };
  moneyline?: { home: number; away: number };
  total?: { over: number; under: number; line: number };
}

interface OddsTableProps {
  odds: OddsRow[];
  homeTeam: string;
  awayTeam: string;
  maxBooks?: number;
  className?: string;
}

function formatOdds(val: number | undefined): string {
  if (val == null) return '—';
  return val > 0 ? `+${val}` : `${val}`;
}

function isBest(values: (number | undefined)[], idx: number, preferHigher: boolean): boolean {
  const filtered = values.filter((v: number | undefined): v is number => v != null);
  if (filtered.length === 0) return false;
  const target = preferHigher ? Math.max(...filtered) : Math.min(...filtered);
  return values[idx] === target;
}

export function OddsTable({ odds, homeTeam, awayTeam, maxBooks, className }: OddsTableProps) {
  const displayOdds = maxBooks ? (odds ?? []).slice(0, maxBooks) : (odds ?? []);

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Book</th>
            <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium" colSpan={2}>Spread</th>
            <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium" colSpan={2}>Moneyline</th>
            <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium" colSpan={2}>Total</th>
          </tr>
          <tr className="border-b border-border/50">
            <th className="py-1 px-3" />
            <th className="text-center py-1 px-2 text-xs text-muted-foreground">{awayTeam?.split(' ')?.pop() ?? 'Away'}</th>
            <th className="text-center py-1 px-2 text-xs text-muted-foreground">{homeTeam?.split(' ')?.pop() ?? 'Home'}</th>
            <th className="text-center py-1 px-2 text-xs text-muted-foreground">{awayTeam?.split(' ')?.pop() ?? 'Away'}</th>
            <th className="text-center py-1 px-2 text-xs text-muted-foreground">{homeTeam?.split(' ')?.pop() ?? 'Home'}</th>
            <th className="text-center py-1 px-2 text-xs text-muted-foreground">Over</th>
            <th className="text-center py-1 px-2 text-xs text-muted-foreground">Under</th>
          </tr>
        </thead>
        <tbody>
          {displayOdds.map((row: OddsRow, i: number) => (
            <tr key={row?.bookmaker ?? i} className="border-b border-border/30 hover:bg-secondary/50 transition-colors">
              <td className="py-2.5 px-3 font-medium text-foreground">{row?.bookmaker ?? 'Unknown'}</td>
              <td className={cn('text-center py-2.5 px-2 font-mono text-sm',
                isBest(displayOdds.map((o: OddsRow) => o?.spread?.awayOdds), i, true) && 'text-primary font-bold'
              )}>
                {row?.spread ? `${row.spread.away > 0 ? '+' : ''}${row.spread.away} (${formatOdds(row.spread.awayOdds)})` : '—'}
              </td>
              <td className={cn('text-center py-2.5 px-2 font-mono text-sm',
                isBest(displayOdds.map((o: OddsRow) => o?.spread?.homeOdds), i, true) && 'text-primary font-bold'
              )}>
                {row?.spread ? `${row.spread.home > 0 ? '+' : ''}${row.spread.home} (${formatOdds(row.spread.homeOdds)})` : '—'}
              </td>
              <td className={cn('text-center py-2.5 px-2 font-mono text-sm',
                isBest(displayOdds.map((o: OddsRow) => o?.moneyline?.away), i, true) && 'text-primary font-bold'
              )}>
                {formatOdds(row?.moneyline?.away)}
              </td>
              <td className={cn('text-center py-2.5 px-2 font-mono text-sm',
                isBest(displayOdds.map((o: OddsRow) => o?.moneyline?.home), i, true) && 'text-primary font-bold'
              )}>
                {formatOdds(row?.moneyline?.home)}
              </td>
              <td className={cn('text-center py-2.5 px-2 font-mono text-sm',
                isBest(displayOdds.map((o: OddsRow) => o?.total?.over), i, true) && 'text-primary font-bold'
              )}>
                {row?.total ? `O ${row.total.line} (${formatOdds(row.total.over)})` : '—'}
              </td>
              <td className={cn('text-center py-2.5 px-2 font-mono text-sm',
                isBest(displayOdds.map((o: OddsRow) => o?.total?.under), i, true) && 'text-primary font-bold'
              )}>
                {row?.total ? `U ${row.total.line} (${formatOdds(row.total.under)})` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
