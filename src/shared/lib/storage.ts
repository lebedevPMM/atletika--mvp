import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

// Web fallback using localStorage
const webStorage: StateStorage = {
  getItem: (name) => {
    try { return localStorage.getItem(name); } catch { return null; }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value); } catch {}
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name); } catch {}
  },
};

// MMKV — native only (JSI module, crashes on web)
let mmkvStorage: StateStorage = webStorage;
let mmkvQueryStorage = {
  getItem: (key: string) => webStorage.getItem(key),
  setItem: (key: string, value: string) => webStorage.setItem(key, value),
  removeItem: (key: string) => webStorage.removeItem(key),
};

if (Platform.OS !== 'web') {
  const { createMMKV } = require('react-native-mmkv');
  const mmkv = createMMKV();
  mmkvStorage = {
    getItem: (name) => mmkv.getString(name) ?? null,
    setItem: (name, value) => mmkv.set(name, value),
    removeItem: (name) => { mmkv.remove(name); },
  };
  mmkvQueryStorage = {
    getItem: (key: string) => mmkv.getString(key) ?? null,
    setItem: (key: string, value: string) => mmkv.set(key, value),
    removeItem: (key: string) => { mmkv.remove(key); },
  };
}

export { mmkvStorage, mmkvQueryStorage };
