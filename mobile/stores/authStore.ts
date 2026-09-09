// BetEdge AI — Auth Store (Zustand)
import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasOnboarded: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  setHasOnboarded: (val: boolean) => void;
  setLoading: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasOnboarded: false,
  setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
  setUser: (user) => set({ user }),
  setHasOnboarded: (val) => set({ hasOnboarded: val }),
  setLoading: (val) => set({ isLoading: val }),
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));
