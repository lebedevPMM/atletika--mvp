import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Badge, Skeleton, ErrorState, EmptyState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useScreenView } from '@/features/analytics/tracker';
import { useClubNews } from '@/features/club/hooks';
import { getNewsCategoryLabel, getNewsCategoryBadgeVariant, formatNewsDate } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';
import type { NewsItem } from '@/features/club/types';

export default function ClubNewsScreen() {
  useScreenView('client_club_news');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();

  const { data: news, isLoading, isError, refetch, isRefetching } = useClubNews();

  const handleNewsPress = useCallback(
    (newsId: string) => {
      router.push(`/(client)/(more)/club/news/${newsId}`);
    },
    [router],
  );

  const renderNewsCard = useCallback(
    ({ item }: { item: NewsItem }) => (
      <Pressable
        onPress={() => handleNewsPress(item.id)}
        style={({ pressed }) => [styles.newsCard, pressed && styles.newsCardPressed]}
      >
        <View style={styles.newsHeader}>
          <Badge
            text={getNewsCategoryLabel(item.category)}
            variant={getNewsCategoryBadgeVariant(item.category)}
          />
          <Text style={styles.newsDate}>{formatNewsDate(item.publishedAt)}</Text>
        </View>
        <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>
        {!item.isRead && <View style={styles.unreadDot} />}
      </Pressable>
    ),
    [handleNewsPress, styles],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Новости</Text>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="card" /><Skeleton variant="card" /><Skeleton variant="card" />
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
          <Text style={styles.headerTitle}>Новости</Text>
        </View>
        <ErrorState message="Не удалось загрузить новости" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Новости</Text>
      </View>

      <FlatList
        data={news ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsCard}
        contentContainerStyle={[
          styles.listContent,
          (news ?? []).length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={<EmptyState icon="📰" title="Нет новостей" subtitle="Здесь появятся новости клуба" />}
      />
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[3],
    gap: SPACING[3],
  },
  headerTitle: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backText: {
    fontSize: 20,
    color: t.colors.text.primary,
  },
  skeletonList: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  listContent: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[6],
    gap: SPACING[3],
  },
  emptyContainer: {
    flex: 1,
  },
  newsCard: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[2],
    position: 'relative' as const,
  },
  newsCardPressed: {
    opacity: 0.85,
  },
  newsHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  newsDate: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  newsTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  newsSummary: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  unreadDot: {
    position: 'absolute' as const,
    top: SPACING[3],
    right: SPACING[3],
    width: 8,
    height: 8,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accent.primary,
  },
}));
