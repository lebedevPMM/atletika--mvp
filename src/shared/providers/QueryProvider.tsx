import { type ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { mmkvQueryStorage } from '@/shared/lib/storage';
import { ApiError } from '@/shared/api/error';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 60_000,
      gcTime: 30 * 60_000,
      retry: (count, error) => {
        if (error instanceof ApiError && error.status === 401) return false;
        return count < 3;
      },
    },
    mutations: {
      networkMode: 'online',
    },
  },
});

const persister = createSyncStoragePersister({
  storage: mmkvQueryStorage,
  key: 'query-cache',
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  );
}

export { queryClient };
