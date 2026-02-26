const store = new Map<string, string>();

export const secureStorage = {
  get: async (key: string): Promise<string | null> => store.get(key) ?? null,
  set: async (key: string, value: string): Promise<void> => { store.set(key, value); },
  remove: async (key: string): Promise<void> => { store.delete(key); },
};

/** Reset mock storage between tests */
export function resetMockSecureStorage() {
  store.clear();
}
