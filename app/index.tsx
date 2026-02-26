import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/store';
import { useClubStore } from '@/features/club/store';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clubId = useClubStore((s) => s.clubId);

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!clubId) return <Redirect href="/(auth)/club-loading" />;
  return <Redirect href="/(client)/(home)" />;
}
