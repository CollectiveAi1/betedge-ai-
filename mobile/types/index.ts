// BetEdge AI — TypeScript Types

export type Sport = 'ALL' | 'NFL' | 'NBA' | 'MLB' | 'NCAAF' | 'NCAAB';

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export type Recommendation = 'OVER' | 'UNDER' | 'AVOID' | 'LEAN OVER' | 'LEAN UNDER';

export type PickResult = 'WIN' | 'LOSS' | 'PUSH' | 'PENDING';

export type SubscriptionTier = 'free' | 'pro' | 'elite';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscriptionTier: SubscriptionTier;
}

export interface BookOdds {
  book: string;
  odds: number;
  isBest?: boolean;
}

export interface Pick {
  id: string;
  sport: Sport;
  sportEmoji: string;
  playerName: string;
  team: string;
  position: string;
  statType: string;
  line: number;
  grade: Grade;
  confidence: number;
  recommendation: Recommendation;
  edgeSummary: string;
  gameInfo: string;
  bookOdds: BookOdds[];
  keyFactors: string[];
  risks: string[];
  trendOverCount: number;
  trendTotal: number;
  trendAvg: number;
  aiAnalysis: string;
  isSaved?: boolean;
  gameId?: string;
}

export interface Game {
  id: string;
  sport: Sport;
  sportEmoji: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: string;
  status: 'scheduled' | 'live' | 'final';
  homeScore?: number;
  awayScore?: number;
  spread?: string;
  overUnder?: number;
  venue?: string;
}

export interface PlayerProp {
  id: string;
  sport: Sport;
  sportEmoji: string;
  playerName: string;
  team: string;
  position: string;
  statType: string;
  line: number;
  grade: Grade;
  confidence: number;
  recommendation: Recommendation;
  edgeSummary: string;
  gameInfo: string;
  gameId: string;
  bookOdds: BookOdds[];
  keyFactors: string[];
  risks: string[];
  trendOverCount: number;
  trendTotal: number;
  trendAvg: number;
  aiAnalysis: string;
}

export interface SavedPick {
  id: string;
  playerName: string;
  team: string;
  statType: string;
  line: number;
  recommendation: Recommendation;
  grade: Grade;
  confidence: number;
  result: PickResult;
  date: string;
  sport: Sport;
}

export interface ParlayLeg {
  id: string;
  propId: string;
  playerName: string;
  team: string;
  statType: string;
  line: number;
  recommendation: Recommendation;
  grade: Grade;
  confidence: number;
  odds: number;
}

export interface Alert {
  id: string;
  type: 'line_movement' | 'injury';
  title: string;
  description: string;
  timestamp: string;
  sport: Sport;
  sportEmoji: string;
}

export interface TierFeature {
  name: string;
  free: string;
  pro: string;
  elite: string;
}
