import { create } from 'zustand';

interface UIState {
  isOffline: boolean;
  unreadNotifications: number;

  setOffline: (offline: boolean) => void;
  setUnread: (count: number) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isOffline: false,
  unreadNotifications: 0,

  setOffline: (isOffline) => set({ isOffline }),
  setUnread: (unreadNotifications) => set({ unreadNotifications }),
}));
