// BetEdge AI — API Client with Mock Data Fallback
import axios from 'axios';
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

const apiClient = axios.create({
  baseURL: BASE_URL || undefined,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  transformRequest: [
    (data: unknown) => {
      if (data && typeof data === 'object') return JSON.stringify(data);
      return data;
    },
  ],
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

function useMock(): boolean {
  return !BASE_URL;
}

// Helper to safely make API calls with mock fallback
async function safeApiCall<T>(apiCall: () => Promise<T>, mockData: T): Promise<T> {
  if (useMock()) return mockData;
  try {
    return await apiCall();
  } catch {
    return mockData;
  }
}

// --- API Functions ---

export async function getPicks(sport?: string): Promise<Pick[]> {
  return safeApiCall(async () => {
    const url = new URL('/api/dashboard/picks', BASE_URL).toString();
    const res = await apiClient.get(url, { params: sport && sport !== 'ALL' ? { sport } : undefined });
    return res?.data ?? [];
  }, sport && sport !== 'ALL' ? MOCK_PICKS.filter((p) => p?.sport === sport) : MOCK_PICKS);
}

export async function getGames(sport?: string, date?: string): Promise<Game[]> {
  return safeApiCall(async () => {
    const url = new URL('/api/sports/games', BASE_URL).toString();
    const res = await apiClient.get(url, { params: { sport, date } });
    return res?.data ?? [];
  }, sport && sport !== 'ALL' ? MOCK_GAMES.filter((g) => g?.sport === sport) : MOCK_GAMES);
}

export async function getGameDetail(gameId: string): Promise<Game | undefined> {
  return safeApiCall(async () => {
    const url = new URL(`/api/sports/games/${gameId}`, BASE_URL).toString();
    const res = await apiClient.get(url);
    return res?.data;
  }, MOCK_GAMES.find((g) => g?.id === gameId));
}

export async function getProps(sport?: string): Promise<PlayerProp[]> {
  return safeApiCall(async () => {
    const url = new URL('/api/sports/props', BASE_URL).toString();
    const res = await apiClient.get(url, { params: sport && sport !== 'ALL' ? { sport } : undefined });
    return res?.data ?? [];
  }, sport && sport !== 'ALL' ? MOCK_PROPS.filter((p) => p?.sport === sport) : MOCK_PROPS);
}

export async function getPropDetail(propId: string): Promise<PlayerProp | undefined> {
  return safeApiCall(async () => {
    const url = new URL(`/api/sports/props/${propId}`, BASE_URL).toString();
    const res = await apiClient.get(url);
    return res?.data;
  }, MOCK_PROPS.find((p) => p?.id === propId));
}

export async function getPropsForGame(gameId: string): Promise<PlayerProp[]> {
  return safeApiCall(async () => {
    const url = new URL('/api/sports/props', BASE_URL).toString();
    const res = await apiClient.get(url, { params: { gameId } });
    return res?.data ?? [];
  }, MOCK_PROPS.filter((p) => p?.gameId === gameId));
}

export async function getUserPicks(): Promise<SavedPick[]> {
  return safeApiCall(async () => {
    const url = new URL('/api/user/picks', BASE_URL).toString();
    const res = await apiClient.get(url);
    return res?.data ?? [];
  }, MOCK_SAVED_PICKS);
}

export async function savePick(pickId: string): Promise<boolean> {
  return safeApiCall(async () => {
    const url = new URL('/api/user/picks', BASE_URL).toString();
    await apiClient.post(url, { pickId });
    return true;
  }, true);
}

export async function getAlerts(): Promise<Alert[]> {
  return safeApiCall(async () => {
    const url = new URL('/api/user/alerts', BASE_URL).toString();
    const res = await apiClient.get(url);
    return res?.data ?? [];
  }, MOCK_ALERTS);
}

export async function saveParlays(legs: unknown[]): Promise<boolean> {
  return safeApiCall(async () => {
    const url = new URL('/api/user/parlays', BASE_URL).toString();
    await apiClient.post(url, { legs });
    return true;
  }, true);
}

export async function getCheckoutUrl(tier: string): Promise<string> {
  return safeApiCall(async () => {
    const url = new URL('/api/stripe/checkout', BASE_URL).toString();
    const res = await apiClient.get(url, { params: { tier } });
    return res?.data?.url ?? '';
  }, 'https://checkout.stripe.com/demo');
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
  return safeApiCall(async () => {
    const url = new URL('/api/auth/login', BASE_URL).toString();
    const res = await apiClient.post(url, { email, password });
    return res?.data;
  }, { token: 'mock_jwt_token_12345', user: MOCK_USER });
}

export async function signupUser(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
  return safeApiCall(async () => {
    const url = new URL('/api/signup', BASE_URL).toString();
    const res = await apiClient.post(url, { name, email, password });
    return res?.data;
  }, { token: 'mock_jwt_token_12345', user: { ...MOCK_USER, name, email } });
}

export async function getUserProfile(): Promise<User> {
  return safeApiCall(async () => {
    const url = new URL('/api/user/profile', BASE_URL).toString();
    const res = await apiClient.get(url);
    return res?.data;
  }, MOCK_USER);
}
