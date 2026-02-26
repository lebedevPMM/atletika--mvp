import { createMMKV, type MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export const mmkv: MMKV = createMMKV();

// Zustand-compatible storage adapter
export const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => { mmkv.remove(name); },
};

// TanStack Query persist adapter
export const mmkvQueryStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => { mmkv.remove(key); },
};
