import { Platform } from 'react-native';

// Web fallback — localStorage (not truly secure, but sufficient for demo)
const webSecureStorage = {
  get: async (key: string): Promise<string | null> => {
    try { return localStorage.getItem(`secure_${key}`); } catch { return null; }
  },
  set: async (key: string, value: string): Promise<void> => {
    try { localStorage.setItem(`secure_${key}`, value); } catch {}
  },
  remove: async (key: string): Promise<void> => {
    try { localStorage.removeItem(`secure_${key}`); } catch {}
  },
};

let secureStorage = webSecureStorage;

if (Platform.OS !== 'web') {
  const SecureStore = require('expo-secure-store');
  secureStorage = {
    get: async (key: string): Promise<string | null> => SecureStore.getItemAsync(key),
    set: async (key: string, value: string): Promise<void> => { await SecureStore.setItemAsync(key, value); },
    remove: async (key: string): Promise<void> => { await SecureStore.deleteItemAsync(key); },
  };
}

export { secureStorage };
