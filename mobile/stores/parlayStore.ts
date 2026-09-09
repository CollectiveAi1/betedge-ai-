// BetEdge AI — Parlay Store (Zustand)
import { create } from 'zustand';
import type { ParlayLeg } from '../types';

interface ParlayState {
  legs: ParlayLeg[];
  addLeg: (leg: ParlayLeg) => void;
  removeLeg: (id: string) => void;
  clearAll: () => void;
}

export const useParlayStore = create<ParlayState>((set) => ({
  legs: [],
  addLeg: (leg) =>
    set((state) => {
      // Don't add duplicates
      if (state.legs?.some((l) => l?.propId === leg?.propId)) return state;
      return { legs: [...(state.legs ?? []), leg] };
    }),
  removeLeg: (id) =>
    set((state) => ({
      legs: (state.legs ?? []).filter((l) => l?.id !== id),
    })),
  clearAll: () => set({ legs: [] }),
}));
