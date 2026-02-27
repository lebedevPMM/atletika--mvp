import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Badge, Skeleton, ErrorState, EmptyState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useReviews } from '@/features/reviews/hooks';
import { getReviewTypeLabel, getReviewTypeIcon, formatStars } from '@/features/reviews/utils';
import { formatNewsDate } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';
import type { Review } from '@/features/reviews/types';

export default function ReviewsScreen() {
  useScreenView('client_reviews');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: reviews, isLoading, isError, refetch, isRefetching } = useReviews();

  const handleAdd = useCallback(() => {
    haptic.selection();
    router.push('/(client)/(more)/review-create' as never);
  }, [haptic, router]);

  const renderItem = useCallback(
    ({ item }: { item: Review }) => {
      const targetName = item.trainerName || item.className;

      return (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.authorName} numberOfLines={1}>{item.authorName}</Text>
            <Badge text={getReviewTypeLabel(item.type)} variant="info" />
          </View>
          <Text style={styles.stars}>{formatStars(item.rating)}</Text>
          <Text style={styles.reviewText} numberOfLines={4}>{item.text}</Text>
          {targetName ? (
            <View style={styles.targetRow}>
              <Text style={styles.targetIcon}>{getReviewTypeIcon(item.type)}</Text>
              <Text style={styles.targetName} numberOfLines={1}>{targetName}</Text>
            </View>
          ) : null}
          <Text style={styles.date}>{formatNewsDate(item.date)}</Text>
        </View>
      );
    },
    [styles],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Отзывы</Text>
          <View style={{ flex: 1 }} />
          <Pressable onPress={handleAdd} style={styles.addBtn}>
            <Text style={styles.addText}>{'+'}</Text>
          </Pressable>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
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
          <Text style={styles.headerTitle}>Отзывы</Text>
          <View style={{ flex: 1 }} />
          <Pressable onPress={handleAdd} style={styles.addBtn}>
            <Text style={styles.addText}>{'+'}</Text>
          </Pressable>
        </View>
        <ErrorState message="Не удалось загрузить отзывы" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Отзывы</Text>
        <View style={{ flex: 1 }} />
        <Pressable onPress={handleAdd} style={styles.addBtn}>
          <Text style={styles.addText}>{'+'}</Text>
        </Pressable>
      </View>

      <FlatList
        data={reviews ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          (reviews ?? []).length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="⭐"
            title="Нет отзывов"
            subtitle="Оставьте первый отзыв после тренировки"
          />
        }
      />
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.bg.primary },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[3],
    gap: SPACING[3],
  },
  headerTitle: { ...t.typography.h3, color: t.colors.text.primary },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backText: { fontSize: 20, color: t.colors.text.primary },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accent.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  addText: { fontSize: 24, color: t.colors.text.inverse, fontWeight: '600' as const },
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  listContent: { paddingHorizontal: SPACING[4], paddingBottom: SPACING[6], gap: SPACING[3] },
  emptyContainer: { flex: 1 },
  card: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[2],
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  authorName: {
    ...t.typography.body,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
    flex: 1,
    marginRight: SPACING[2],
  },
  stars: { fontSize: 18, letterSpacing: 2 },
  reviewText: { ...t.typography.bodySm, color: t.colors.text.secondary },
  targetRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[2],
  },
  targetIcon: { fontSize: 16 },
  targetName: { ...t.typography.caption, color: t.colors.text.tertiary, flex: 1 },
  date: { ...t.typography.caption, color: t.colors.text.tertiary },
}));
