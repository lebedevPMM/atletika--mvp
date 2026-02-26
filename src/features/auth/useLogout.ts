import { useRouter } from 'expo-router';
import { useAuthStore } from './store';
import { useClubStore } from '@/features/club/store';
import { authApi } from './api';
import { analytics } from '@/features/analytics/tracker';

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore API errors on logout
    }
    await useAuthStore.getState().logout();
    useClubStore.getState().reset();
    analytics.track({ name: 'auth_logout', params: {} });
    router.replace('/(auth)/login');
  };

  return logout;
}
