import { Redirect } from 'expo-router';
import { useAuthStore } from '@/features/auth/store';
import { useClubStore } from '@/features/club/store';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole = useAuthStore((s) => s.user?.role);
  const clubId = useClubStore((s) => s.clubId);

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (!clubId) return <Redirect href="/(auth)/club-loading" />;

  if (userRole === 'trainer') return <Redirect href="/(trainer)/(home)" />;
  return <Redirect href="/(client)/(home)" />;
}
