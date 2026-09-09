// BetEdge AI — API client.
//
// With no EXPO_PUBLIC_API_URL configured the app runs entirely on bundled demo data.
// Once a backend URL is set, read calls fall back to that demo data if the request
// fails, so a flaky network degrades into a browsable (clearly stale) screen rather
// than a crash. Auth and write calls deliberately do NOT fall back: signing someone
// in against mock data when the server rejected their password would be a security
// hole, and a "saved!" toast for a write that never landed is a lie.
import axios, { type AxiosInstance } from 'axios';
import type { Pick, Game, PlayerProp, SavedPick, Alert, User } from '../types';
import {
  MOCK_PICKS,
  MOCK_GAMES,
  MOCK_PROPS,
  MOCK_SAVED_PICKS,
  MOCK_ALERTS,
  MOCK_USER,
} from '../constants/mockData';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

/** True when no backend is configured and the app should serve bundled demo data. */
export function isDemoMode(): boolean {
  return !BASE_URL;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL || undefined,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

/**
 * Read helper. The web routes wrap their payload in a named key
 * (`{ games: [...] }`, `{ picks: [...] }`, ...), so `key` says which field to unwrap
 * — reading `res.data` directly would hand callers an object where they expect a list.
 */
async function read<T>(path: string, key: string, fallback: T, params?: Record<string, unknown>): Promise<T> {
  if (isDemoMode()) return fallback;
  try {
    const res = await apiClient.get(path, { params });
    const payload = res?.data?.[key];
    return (payload ?? fallback) as T;
  } catch (err) {
    console.warn(`[api] GET ${path} failed, serving demo data:`, err);
    return fallback;
  }
}

// --- Reads ---

export async function getPicks(sport?: string): Promise<Pick[]> {
  const scoped = sport && sport !== 'ALL' ? sport : undefined;
  return read('/api/dashboard/picks', 'picks',
    scoped ? MOCK_PICKS.filter((p) => p?.sport === scoped) : MOCK_PICKS,
    scoped ? { sport: scoped.toLowerCase() } : undefined);
}

export async function getGames(sport?: string, date?: 'today' | 'tomorrow'): Promise<Game[]> {
  const scoped = sport && sport !== 'ALL' ? sport : undefined;
  return read('/api/sports/games', 'games',
    scoped ? MOCK_GAMES.filter((g) => g?.sport === scoped) : MOCK_GAMES,
    { ...(scoped ? { sport: scoped.toLowerCase() } : {}), ...(date ? { date } : {}) });
}

export async function getGameDetail(gameId: string): Promise<Game | undefined> {
  // The web API resolves a single game through a query param, not a path segment.
  return read('/api/sports/games', 'game',
    MOCK_GAMES.find((g) => g?.id === gameId), { gameId });
}

export async function getProps(sport?: string): Promise<PlayerProp[]> {
  const scoped = sport && sport !== 'ALL' ? sport : undefined;
  return read('/api/sports/props', 'props',
    scoped ? MOCK_PROPS.filter((p) => p?.sport === scoped) : MOCK_PROPS,
    scoped ? { sport: scoped.toLowerCase() } : undefined);
}

export async function getPropDetail(propId: string): Promise<PlayerProp | undefined> {
  return read('/api/sports/props', 'prop',
    MOCK_PROPS.find((p) => p?.id === propId), { propId });
}

export async function getPropsForGame(gameId: string): Promise<PlayerProp[]> {
  return read('/api/sports/props', 'props',
    MOCK_PROPS.filter((p) => p?.gameId === gameId), { gameId });
}

export async function getUserPicks(): Promise<SavedPick[]> {
  return read('/api/user/picks', 'picks', MOCK_SAVED_PICKS);
}

export async function getAlerts(): Promise<Alert[]> {
  return read('/api/user/alerts', 'alerts', MOCK_ALERTS);
}

// --- Writes: these report failure instead of pretending to succeed ---

export interface SavePickInput {
  sport: string;
  statType: string;
  playerName: string;
  line: number;
  recommendation: string;
  odds: number;
}

export async function savePick(pick: SavePickInput): Promise<void> {
  if (isDemoMode()) return;
  // The web route stores a described pick, not a bare id.
  await apiClient.post('/api/user/picks', {
    sport: pick.sport.toLowerCase(),
    league: pick.sport.toUpperCase(),
    marketType: 'PROP',
    description: `${pick.playerName} ${pick.recommendation} ${pick.line} ${pick.statType}`,
    selection: pick.recommendation,
    odds: pick.odds,
  });
}

export async function saveParlay(legs: unknown[], combinedOdds: number): Promise<void> {
  if (isDemoMode()) return;
  await apiClient.post('/api/user/parlays', { legs, combinedOdds });
}

export async function getCheckoutUrl(planId: string, billingCycle: 'monthly' | 'annual' = 'monthly'): Promise<string> {
  if (isDemoMode()) return '';
  // Checkout is a POST on the web app; a GET returns 405.
  const res = await apiClient.post('/api/stripe/checkout', { planId, billingCycle });
  return res?.data?.url ?? '';
}

// --- Auth: never falls back to demo data ---

export class AuthError extends Error {}

function authErrorFrom(err: unknown, fallbackMessage: string): AuthError {
  if (axios.isAxiosError(err)) {
    const message = (err.response?.data as { error?: string } | undefined)?.error;
    return new AuthError(message ?? (err.response ? fallbackMessage : 'Network error. Please try again.'));
  }
  return new AuthError(fallbackMessage);
}

/**
 * Signs in to the bundled demo account. Only reachable from the explicitly labelled
 * demo button that the login screen shows when no backend is configured — it is
 * never used as a fallback for a rejected password.
 */
export function demoSignIn(): { token: string; user: User } {
  return { token: 'demo', user: MOCK_USER };
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
  if (isDemoMode()) {
    throw new AuthError('No backend is configured. Use "Explore demo data" below.');
  }
  try {
    const res = await apiClient.post('/api/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    const { token, user } = res?.data ?? {};
    if (!token || !user) throw new AuthError('Unexpected response from server.');
    return { token, user };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw authErrorFrom(err, 'Invalid email or password.');
  }
}

export async function signupUser(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
  if (isDemoMode()) {
    throw new AuthError('No backend is configured, so accounts cannot be created.');
  }
  try {
    const res = await apiClient.post('/api/signup', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    const { token, user } = res?.data ?? {};
    if (!token || !user) throw new AuthError('Unexpected response from server.');
    return { token, user };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw authErrorFrom(err, 'Could not create your account.');
  }
}
