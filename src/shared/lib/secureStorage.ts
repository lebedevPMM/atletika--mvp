import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  get: async (key: string): Promise<string | null> => {
    return SecureStore.getItemAsync(key);
  },
  set: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },
  remove: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },
};
