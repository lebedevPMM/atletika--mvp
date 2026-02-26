import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/lib/storage';
import { secureStorage } from '@/shared/lib/secureStorage';
import type { AuthUser } from './types';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  firstLogin: boolean;
  docsUpdated: boolean;

  setAuth: (accessToken: string, refreshToken: string, user: AuthUser) => Promise<void>;
  setFirstLogin: (v: boolean) => void;
  setDocsUpdated: (v: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      firstLogin: false,
      docsUpdated: false,

      setAuth: async (accessToken, refreshToken, user) => {
        await secureStorage.set('refresh_token', refreshToken);
        set({ accessToken, user, isAuthenticated: true });
      },

      setFirstLogin: (firstLogin) => set({ firstLogin }),
      setDocsUpdated: (docsUpdated) => set({ docsUpdated }),

      logout: async () => {
        await secureStorage.remove('refresh_token');
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          firstLogin: false,
          docsUpdated: false,
        });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // accessToken NOT persisted to MMKV (memory only)
      }),
    },
  ),
);
