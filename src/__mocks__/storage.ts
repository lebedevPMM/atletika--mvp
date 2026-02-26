const store = new Map<string, string>();

export const mmkv = {
  getString: (key: string) => store.get(key) ?? null,
  set: (key: string, value: string) => { store.set(key, value); },
  remove: (key: string) => { store.delete(key); },
};

export const mmkvStorage = {
  getItem: (name: string) => store.get(name) ?? null,
  setItem: (name: string, value: string) => { store.set(name, value); },
  removeItem: (name: string) => { store.delete(name); },
};

export const mmkvQueryStorage = mmkvStorage;

/** Reset mock storage between tests */
export function resetMockStorage() {
  store.clear();
}
