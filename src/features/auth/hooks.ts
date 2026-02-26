import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from './store';
import { useClubStore } from '@/features/club/store';

export function useAuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clubId = useClubStore((s) => s.clubId);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !clubId && !inAuthGroup) {
      router.replace('/(auth)/club-loading');
    }
  }, [isAuthenticated, clubId, segments, router]);
}
