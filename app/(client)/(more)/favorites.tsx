import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Skeleton, ErrorState, EmptyState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useFavorites, useRemoveFavorite } from '@/features/health/hooks';
import { getFavoriteIcon } from '@/features/health/utils';
import { SPACING } from '@/shared/theme/types';
import type { FavoriteItem } from '@/features/health/types';

export default function FavoritesScreen() {
  useScreenView('client_favorites');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: favorites, isLoading, isError, refetch, isRefetching } = useFavorites();
  const removeFavorite = useRemoveFavorite();

  const handleRemove = useCallback(
    (item: FavoriteItem) => {
      haptic.selection();
      Alert.alert('Убрать из избранного?', item.title, [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Убрать',
          style: 'destructive',
          onPress: () => removeFavorite.mutate(item.id),
        },
      ]);
    },
    [haptic, removeFavorite],
  );

  const renderItem = useCallback(
    ({ item }: { item: FavoriteItem }) => (
      <Pressable
        style={({ pressed }) => [styles.favCard, pressed && styles.favCardPressed]}
        onLongPress={() => handleRemove(item)}
      >
        <Text style={styles.favIcon}>{getFavoriteIcon(item.type)}</Text>
        <View style={styles.favContent}>
          <Text style={styles.favTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.favSubtitle} numberOfLines={1}>{item.subtitle}</Text>
        </View>
        {item.rating != null && (
          <Text style={styles.favRating}>{'★ '}{item.rating.toFixed(1)}</Text>
        )}
      </Pressable>
    ),
    [styles, handleRemove],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Избранное</Text>
        </View>
        <View style={styles.skeletonList}><Skeleton variant="card" /><Skeleton variant="card" /></View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Избранное</Text>
        </View>
        <ErrorState message="Не удалось загрузить избранное" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Избранное</Text>
      </View>

      <FlatList
        data={favorites ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, (favorites ?? []).length === 0 && styles.emptyContainer]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={
          <EmptyState icon="❤️" title="Нет избранного" subtitle="Добавляйте тренеров и занятия в избранное" />
        }
      />
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.bg.primary },
  header: {
    flexDirection: 'row' as const, alignItems: 'center' as const,
    paddingHorizontal: SPACING[4], paddingTop: SPACING[2], paddingBottom: SPACING[3], gap: SPACING[3],
  },
  headerTitle: { ...t.typography.h3, color: t.colors.text.primary },
  backBtn: {
    width: 40, height: 40, borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated, alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  backText: { fontSize: 20, color: t.colors.text.primary },
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  listContent: { paddingHorizontal: SPACING[4], paddingBottom: SPACING[6], gap: SPACING[2] },
  emptyContainer: { flex: 1 },
  favCard: {
    flexDirection: 'row' as const, backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg, padding: SPACING[4], gap: SPACING[3], alignItems: 'center' as const,
  },
  favCardPressed: { opacity: 0.85 },
  favIcon: { fontSize: 32 },
  favContent: { flex: 1, gap: SPACING[1] },
  favTitle: { ...t.typography.body, color: t.colors.text.primary, fontWeight: '600' as const },
  favSubtitle: { ...t.typography.bodySm, color: t.colors.text.secondary },
  favRating: { ...t.typography.bodySm, color: t.colors.semantic.warning.main, fontWeight: '600' as const },
}));
