import { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ErrorState } from '@/shared/ui';
import { useAuthStore } from '@/features/auth/store';
import { useClubStore } from '@/features/club/store';
import { clubApi } from '@/features/club/api';
import { useScreenView } from '@/features/analytics/tracker';
import { createStyles } from '@/shared/theme/createStyles';

export default function ClubLoadingScreen() {
  useScreenView('client_club_loading');

  const router = useRouter();
  const styles = useStyles();

  const userRole = useAuthStore((s) => s.user?.role);
  const clubId = useClubStore((s) => s.clubId);
  const branchId = useClubStore((s) => s.branchId);

  const [error, setError] = useState<string | null>(null);

  const loadClub = useCallback(async () => {
    setError(null);
    try {
      if (clubId && branchId) {
        await clubApi.selectClub(clubId, branchId);
      }
      const config = await clubApi.getConfig();
      useClubStore.getState().setConfig(config);

      if (userRole === 'trainer') {
        router.replace('/(trainer)/(home)');
      } else {
        router.replace('/(client)/(home)');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Не удалось загрузить клуб';
      setError(message);
    }
  }, [clubId, branchId, userRole, router]);

  useEffect(() => {
    loadClub();
  }, [loadClub]);

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState message={error} onRetry={loadClub} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.label}>Загрузка клуба...</Text>
      </View>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  center: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 12,
  },
  label: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
}));
