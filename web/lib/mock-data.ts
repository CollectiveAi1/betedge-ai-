// Mock data used when API keys are not configured or for demo mode
import type { SportKey } from './sports-config';

export interface MockGame {
  id: string;
  sport: SportKey;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  startTime: string;
  status: string;
  venue: string;
}

export interface MockOdds {
  bookmaker: string;
  spread: { home: number; away: number; homeOdds: number; awayOdds: number };
  moneyline: { home: number; away: number };
  total: { over: number; under: number; line: number };
}

export interface MockProp {
  id: string;
  playerName: string;
  team: string;
  sport: SportKey;
  statType: string;
  line: number;
  overOdds: number;
  underOdds: number;
  grade: string;
  confidence: number;
  recommendation: string;
  edgeSummary: string;
  keyFactors: string[];
  risks: string[];
  /** Times the prop hit over `trendTotal` recent games. */
  trendHits: number;
  trendTotal: number;
}

/**
 * Evaluated per call rather than at module load: a module-scope `new Date()` is
 * computed once when the server process starts and then every mock game keeps that
 * same start time for the life of the process.
 */
function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function buildMockGames(): MockGame[] {
  const todayStr = hoursFromNow(0);
  const later = hoursFromNow(3);
  const evening = hoursFromNow(7);
  return [
    { id: 'nfl-1', sport: 'nfl', homeTeam: 'Kansas City Chiefs', awayTeam: 'Buffalo Bills', homeScore: null, awayScore: null, startTime: evening, status: 'scheduled', venue: 'Arrowhead Stadium' },
    { id: 'nfl-2', sport: 'nfl', homeTeam: 'Philadelphia Eagles', awayTeam: 'Dallas Cowboys', homeScore: null, awayScore: null, startTime: later, status: 'scheduled', venue: 'Lincoln Financial Field' },
    { id: 'nba-1', sport: 'nba', homeTeam: 'Boston Celtics', awayTeam: 'New York Knicks', homeScore: null, awayScore: null, startTime: todayStr, status: 'scheduled', venue: 'TD Garden' },
    { id: 'nba-2', sport: 'nba', homeTeam: 'Denver Nuggets', awayTeam: 'Los Angeles Lakers', homeScore: null, awayScore: null, startTime: later, status: 'scheduled', venue: 'Ball Arena' },
    { id: 'mlb-1', sport: 'mlb', homeTeam: 'New York Yankees', awayTeam: 'Boston Red Sox', homeScore: null, awayScore: null, startTime: todayStr, status: 'scheduled', venue: 'Yankee Stadium' },
    { id: 'mlb-2', sport: 'mlb', homeTeam: 'Los Angeles Dodgers', awayTeam: 'San Francisco Giants', homeScore: null, awayScore: null, startTime: later, status: 'scheduled', venue: 'Dodger Stadium' },
    { id: 'ncaaf-1', sport: 'ncaaf', homeTeam: 'Alabama Crimson Tide', awayTeam: 'Georgia Bulldogs', homeScore: null, awayScore: null, startTime: evening, status: 'scheduled', venue: 'Bryant-Denny Stadium' },
    { id: 'ncaab-1', sport: 'ncaab', homeTeam: 'Duke Blue Devils', awayTeam: 'North Carolina Tar Heels', homeScore: null, awayScore: null, startTime: later, status: 'scheduled', venue: 'Cameron Indoor Stadium' },
  ];
}

export const MOCK_ODDS: Record<string, MockOdds[]> = {
  'nfl-1': [
    { bookmaker: 'DraftKings', spread: { home: -2.5, away: 2.5, homeOdds: -110, awayOdds: -110 }, moneyline: { home: -140, away: 120 }, total: { over: -110, under: -110, line: 47.5 } },
    { bookmaker: 'FanDuel', spread: { home: -3, away: 3, homeOdds: -108, awayOdds: -112 }, moneyline: { home: -145, away: 125 }, total: { over: -112, under: -108, line: 47.5 } },
    { bookmaker: 'BetMGM', spread: { home: -2.5, away: 2.5, homeOdds: -105, awayOdds: -115 }, moneyline: { home: -135, away: 115 }, total: { over: -110, under: -110, line: 48 } },
  ],
  'nfl-2': [
    { bookmaker: 'DraftKings', spread: { home: -4.5, away: 4.5, homeOdds: -110, awayOdds: -110 }, moneyline: { home: -200, away: 170 }, total: { over: -110, under: -110, line: 44.5 } },
    { bookmaker: 'FanDuel', spread: { home: -4, away: 4, homeOdds: -110, awayOdds: -110 }, moneyline: { home: -190, away: 165 }, total: { over: -108, under: -112, line: 44 } },
  ],
  default: [
    { bookmaker: 'DraftKings', spread: { home: -3, away: 3, homeOdds: -110, awayOdds: -110 }, moneyline: { home: -150, away: 130 }, total: { over: -110, under: -110, line: 210.5 } },
    { bookmaker: 'FanDuel', spread: { home: -2.5, away: 2.5, homeOdds: -112, awayOdds: -108 }, moneyline: { home: -145, away: 125 }, total: { over: -108, under: -112, line: 211 } },
  ],
};

export const MOCK_PROPS: MockProp[] = [
  {
    id: 'prop-1', playerName: 'Patrick Mahomes', team: 'KC', sport: 'nfl',
    statType: 'Pass Yards', line: 275.5, overOdds: -115, underOdds: -105,
    grade: 'A', confidence: 87, recommendation: 'STRONG OVER',
    edgeSummary: 'Bills secondary ranks 28th vs pass — Mahomes averages 302 in dome/neutral games.',
    keyFactors: ['Bills allow 258 pass YPG (28th)', 'Mahomes averages 302 YPG in primetime', 'No major KC WR injuries', 'Over has hit 7 of last 10'],
    risks: ['Wind could be a factor if outdoors', 'Game script may shift to run-heavy if blowout'],
    trendHits: 7, trendTotal: 10,
  },
  {
    id: 'prop-2', playerName: 'Jayson Tatum', team: 'BOS', sport: 'nba',
    statType: 'Points', line: 27.5, overOdds: -110, underOdds: -110,
    grade: 'B', confidence: 72, recommendation: 'OVER',
    edgeSummary: 'Tatum averages 31.2 PPG at home — Knicks missing key perimeter defender.',
    keyFactors: ['31.2 PPG at home this season', 'Knicks missing OG Anunoby (knee)', 'Over hit 8 of last 12 home games', 'Celtics favored — extended minutes likely'],
    risks: ['Brown could take larger share', 'Foul trouble risk in physical matchup'],
    trendHits: 8, trendTotal: 12,
  },
  {
    id: 'prop-3', playerName: 'Aaron Judge', team: 'NYY', sport: 'mlb',
    statType: 'Total Bases', line: 1.5, overOdds: -130, underOdds: 110,
    grade: 'A', confidence: 82, recommendation: 'STRONG OVER',
    edgeSummary: 'Judge slugging .620 vs LHP — Red Sox starting a lefty with 5.10 ERA.',
    keyFactors: ['.620 SLG vs LHP this season', 'Red Sox starter has 5.10 ERA', 'Judge has XBH in 6 of last 8 vs BOS', 'Yankee Stadium short porch advantage'],
    risks: ['Small sample vs this specific pitcher', 'Weather could suppress offense'],
    trendHits: 6, trendTotal: 8,
  },
  {
    id: 'prop-4', playerName: 'Jalen Hurts', team: 'PHI', sport: 'nfl',
    statType: 'Rush Yards', line: 35.5, overOdds: -108, underOdds: -112,
    grade: 'B', confidence: 68, recommendation: 'LEAN OVER',
    edgeSummary: 'Cowboys allow 5.1 YPC to QBs — Hurts averages 42 rush yards in rivalry games.',
    keyFactors: ['Cowboys 31st vs QB rush yards', 'Hurts 42 avg rush yards vs DAL', 'Goal-line package frequently used', 'Saquon draws 8+ in box, opens lanes'],
    risks: ['Could be a blowout limiting designed runs', 'Knee concern may reduce scrambles'],
    trendHits: 6, trendTotal: 10,
  },
  {
    id: 'prop-5', playerName: 'Nikola Jokic', team: 'DEN', sport: 'nba',
    statType: 'Assists', line: 9.5, overOdds: 105, underOdds: -125,
    grade: 'C', confidence: 55, recommendation: 'LEAN UNDER',
    edgeSummary: 'Lakers slow pace limits assist opportunities — AD stays in the paint, reducing dump-offs.',
    keyFactors: ['Lakers 27th in pace', 'Jokic averaging 8.8 assists vs LA', 'Murray may be primary ball handler more', 'Under hit 6 of last 9 vs slow teams'],
    risks: ['Jokic triple-double hunting tendency', 'Blowout could change assist pace'],
    trendHits: 3, trendTotal: 9,
  },
  {
    id: 'prop-6', playerName: 'Bryce Young', team: 'ALA', sport: 'ncaaf',
    statType: 'Pass Yards', line: 260.5, overOdds: -110, underOdds: -110,
    grade: 'D', confidence: 40, recommendation: 'AVOID',
    edgeSummary: 'Georgia defense ranks #1 in pass yards allowed — extreme mismatch.',
    keyFactors: ['Georgia allows 152 pass YPG (#1)', 'Alabama offensive line has 2 injuries', 'Weather forecast shows potential rain'],
    risks: ['Garbage time could inflate numbers', 'Young can create outside the pocket'],
    trendHits: 2, trendTotal: 10,
  },
];

export const MOCK_ANALYSIS = {
  grade: 'A',
  confidence: 87,
  recommendation: 'STRONG OVER' as const,
  edgeSummary: 'Strong historical trend with favorable matchup data suggests significant edge.',
  keyFactors: [
    'Favorable defensive matchup — opponent ranks in bottom 5',
    'Player averaging well above line in last 10 games',
    'No significant injury concerns for key players',
    'Historical hit rate of 78% on similar lines',
  ],
  risks: [
    'Game script could shift if blowout occurs early',
    'Weather conditions may impact performance',
  ],
  disclaimer: 'This is educational analysis only. Never guarantee wins.',
};

export function getMockGames(sport?: SportKey): MockGame[] {
  const games = buildMockGames();
  if (!sport) return games;
  return games.filter((g: MockGame) => g.sport === sport);
}

export function getMockOdds(gameId: string): MockOdds[] {
  return MOCK_ODDS[gameId] ?? MOCK_ODDS['default'] ?? [];
}

export function getMockProps(sport?: SportKey): MockProp[] {
  if (!sport) return MOCK_PROPS;
  return MOCK_PROPS.filter((p: MockProp) => p.sport === sport);
}
