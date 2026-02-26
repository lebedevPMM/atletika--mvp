import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, ErrorState } from '@/shared/ui';
import { useClubStore } from '@/features/club/store';
import { clubApi } from '@/features/club/api';
import { useScreenView } from '@/features/analytics/tracker';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { createStyles } from '@/shared/theme/createStyles';
import { SPACING } from '@/shared/theme/types';
import type { Club } from '@/features/club/types';

export default function ClubSelectScreen() {
  useScreenView('client_club_select');

  const router = useRouter();
  const styles = useStyles();
  const haptic = useHaptic();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await clubApi.getMyClubs();
      setClubs(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Не удалось загрузить клубы';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const handleSelect = useCallback(
    (club: Club) => {
      haptic.light();
      useClubStore
        .getState()
        .setClub(club.id, club.branches[0].id, club.name);
      router.replace('/(auth)/club-loading');
    },
    [haptic, router],
  );

  const renderClub = useCallback(
    ({ item }: { item: Club }) => (
      <Card onPress={() => handleSelect(item)} style={styles.card}>
        <Text style={styles.clubName}>{item.name}</Text>
        <Text style={styles.clubAddress}>{item.address}</Text>
      </Card>
    ),
    [handleSelect, styles],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState message={error} onRetry={fetchClubs} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Выберите клуб</Text>
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id}
          renderItem={renderClub}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[6],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    marginBottom: SPACING[4],
  },
  list: {
    gap: SPACING[3],
    paddingBottom: SPACING[8],
  },
  card: {
    // Card already has padding & elevation from shared component
  },
  clubName: {
    ...t.typography.bodyLg,
    fontWeight: '600' as const,
    color: t.colors.text.primary,
  },
  clubAddress: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginTop: SPACING[1],
  },
}));
