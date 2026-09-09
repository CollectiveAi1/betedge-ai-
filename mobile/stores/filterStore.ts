// BetEdge AI — Filter Store (Zustand)
import { create } from 'zustand';
import type { Sport } from '../types';

interface FilterState {
  selectedSport: Sport;
  setSelectedSport: (sport: Sport) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedSport: 'ALL',
  setSelectedSport: (sport) => set({ selectedSport: sport }),
}));
