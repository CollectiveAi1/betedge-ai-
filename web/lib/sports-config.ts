import {
  Trophy,
  Dumbbell,
  CircleDot,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

export type SportKey = 'nfl' | 'nba' | 'mlb' | 'ncaaf' | 'ncaab';

export interface SportConfig {
  key: SportKey;
  name: string;
  shortName: string;
  oddsApiKey: string;
  espnSport: string;
  espnLeague: string;
  icon: LucideIcon;
  color: string;
}

export const SPORTS: Record<SportKey, SportConfig> = {
  nfl: {
    key: 'nfl',
    name: 'NFL',
    shortName: 'NFL',
    oddsApiKey: 'americanfootball_nfl',
    espnSport: 'football',
    espnLeague: 'nfl',
    icon: Trophy,
    color: '#013369',
  },
  nba: {
    key: 'nba',
    name: 'NBA',
    shortName: 'NBA',
    oddsApiKey: 'basketball_nba',
    espnSport: 'basketball',
    espnLeague: 'nba',
    icon: Dumbbell,
    color: '#1D428A',
  },
  mlb: {
    key: 'mlb',
    name: 'MLB',
    shortName: 'MLB',
    oddsApiKey: 'baseball_mlb',
    espnSport: 'baseball',
    espnLeague: 'mlb',
    icon: CircleDot,
    color: '#002D72',
  },
  ncaaf: {
    key: 'ncaaf',
    name: 'NCAAF',
    shortName: 'NCAAF',
    oddsApiKey: 'americanfootball_ncaaf',
    espnSport: 'football',
    espnLeague: 'college-football',
    icon: GraduationCap,
    color: '#8B0000',
  },
  ncaab: {
    key: 'ncaab',
    name: 'NCAAB',
    shortName: 'NCAAB',
    oddsApiKey: 'basketball_ncaab',
    espnSport: 'basketball',
    espnLeague: 'mens-college-basketball',
    icon: GraduationCap,
    color: '#FF6600',
  },
};

export const SPORT_KEYS = Object.keys(SPORTS) as SportKey[];

export const GRADE_COLORS: Record<string, string> = {
  A: '#22C55E',
  B: '#3B82F6',
  C: '#F59E0B',
  D: '#F97316',
  F: '#EF4444',
};

export const RECOMMENDATION_COLORS: Record<string, string> = {
  'STRONG OVER': '#22C55E',
  OVER: '#22C55E',
  'LEAN OVER': '#86EFAC',
  AVOID: '#6B7280',
  'LEAN UNDER': '#FCA5A5',
  UNDER: '#EF4444',
  'STRONG UNDER': '#EF4444',
};
