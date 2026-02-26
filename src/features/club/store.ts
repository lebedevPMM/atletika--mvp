import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/lib/storage';
import type { ClubConfig } from './types';

interface ClubState {
  clubId: string | null;
  branchId: string | null;
  clubName: string | null;
  config: ClubConfig | null;

  setClub: (clubId: string, branchId: string, clubName: string) => void;
  setConfig: (config: ClubConfig) => void;
  reset: () => void;
}

export const useClubStore = create<ClubState>()(
  persist(
    (set) => ({
      clubId: null,
      branchId: null,
      clubName: null,
      config: null,

      setClub: (clubId, branchId, clubName) =>
        set({ clubId, branchId, clubName }),

      setConfig: (config) => set({ config }),

      reset: () =>
        set({ clubId: null, branchId: null, clubName: null, config: null }),
    }),
    {
      name: 'club-store',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
