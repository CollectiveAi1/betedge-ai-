'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ParlayLeg {
  id: string;
  description: string;
  odds: number;
  sport: string;
}

interface ParlayState {
  legs: ParlayLeg[];
  /** Returns false when the leg is already in the slip. */
  addLeg: (leg: ParlayLeg) => boolean;
  removeLeg: (id: string) => void;
  clear: () => void;
}

/**
 * Shared parlay slip. Picks are added from the dashboard, the props list and the prop
 * detail page, and read by the parlay builder, so the slip cannot live in one page's
 * local state. Persisted so a slip survives navigation and reloads.
 */
export const useParlayStore = create<ParlayState>()(
  persist(
    (set, get) => ({
      legs: [],
      addLeg: (leg) => {
        if (get().legs.some((l) => l.id === leg.id)) return false;
        set((state) => ({ legs: [...state.legs, leg] }));
        return true;
      },
      removeLeg: (id) => set((state) => ({ legs: state.legs.filter((l) => l.id !== id) })),
      clear: () => set({ legs: [] }),
    }),
    {
      name: 'betedge-parlay-slip',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
