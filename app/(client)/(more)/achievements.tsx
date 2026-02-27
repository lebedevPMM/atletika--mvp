import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Badge, Skeleton, ErrorState, EmptyState, ProgressBar } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useAchievements } from '@/features/achievements/hooks';
import { getStatusLabel, getCategoryIcon, formatProgress } from '@/features/achievements/utils';
import { formatNewsDate } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';

type AchievementItem =
  | { type: 'header'; title: string; key: string }
  | { type: 'achievement'; item: Achievement; key: string };

interface Achievement {
  id: string;
  title: string;
  description: string;
  status: 'unlocked' | 'in_progress' | 'locked' | 'secret';
  category: string;
  progress?: number;
  target?: number;
  unlockedAt?: string;
}

const STATUS_ORDER: Record<string, number> = {
  unlocked: 0,
  in_progress: 1,
  locked: 2,
  secret: 3,
};

const STATUS_LABELS: Record<string, string> = {
  unlocked: 'Получено',
  in_progress: 'В процессе',
  locked: 'Закрыто',
  secret: 'Секретные',
};

function buildSections(achievements: Achievement[]): AchievementItem[] {
  const grouped = achievements.reduce<Record<string, Achievement[]>>((acc, a) => {
    const key = a.status;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  // Sort unlocked by unlockedAt desc
  if (grouped.unlocked) {
    grouped.unlocked.sort(
      (a, b) => new Date(b.unlockedAt ?? 0).getTime() - new Date(a.unlockedAt ?? 0).getTime(),
    );
  }

  const result: AchievementItem[] = [];
  const statusKeys = Object.keys(grouped).sort(
    (a, b) => (STATUS_ORDER[a] ?? 99) - (STATUS_ORDER[b] ?? 99),
  );

  for (const status of statusKeys) {
    const items = grouped[status];
    if (!items || items.length === 0) continue;
    result.push({ type: 'header', title: STATUS_LABELS[status] ?? status, key: `header-${status}` });
    for (const item of items) {
      result.push({ type: 'achievement', item, key: item.id });
    }
  }

  return result;
}

export default function AchievementsScreen() {
  useScreenView('client_achievements');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: achievements, isLoading, isError, refetch, isRefetching } = useAchievements();

  const allItems = achievements?.achievements ?? [];
  const unlocked = achievements?.unlocked ?? 0;
  const total = achievements?.total ?? 0;
  const sections = buildSections(allItems);

  const renderItem = useCallback(
    ({ item }: { item: AchievementItem }) => {
      if (item.type === 'header') {
        return <Text style={styles.sectionHeader}>{item.title}</Text>;
      }

      const a = item.item;
      const isSecret = a.status === 'secret';
      const isUnlocked = a.status === 'unlocked';
      const isInProgress = a.status === 'in_progress';
      const isLocked = a.status === 'locked';

      return (
        <View
          style={[
            styles.card,
            isUnlocked && { backgroundColor: colors.accent.primary + '18' },
            (isLocked || isSecret) && styles.cardMuted,
          ]}
        >
          <Text style={styles.cardIcon}>
            {isSecret ? '🔒' : getCategoryIcon(a.category)}
          </Text>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, (isLocked || isSecret) && styles.textMuted]} numberOfLines={1}>
              {isSecret ? '???' : a.title}
            </Text>
            <Text style={[styles.cardDesc, (isLocked || isSecret) && styles.textMuted]} numberOfLines={2}>
              {isSecret ? 'Секретное достижение' : a.description}
            </Text>
            {isUnlocked && a.unlockedAt && (
              <Text style={styles.cardDate}>Получено: {formatNewsDate(a.unlockedAt)}</Text>
            )}
            {isInProgress && a.target != null && a.progress != null && (
              <View style={styles.progressRow}>
                <ProgressBar current={a.progress} total={a.target} color={colors.accent.primary} />
                <Text style={styles.progressText}>{formatProgress(a.progress, a.target)}</Text>
              </View>
            )}
            {isLocked && a.target != null && a.progress != null && (
              <View style={styles.progressRow}>
                <ProgressBar current={a.progress} total={a.target} color={colors.text.tertiary} />
                <Text style={styles.progressTextMuted}>{formatProgress(a.progress, a.target)}</Text>
              </View>
            )}
          </View>
        </View>
      );
    },
    [styles, colors],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Достижения</Text>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="card" />
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
          <Text style={styles.headerTitle}>Достижения</Text>
        </View>
        <ErrorState message="Не удалось загрузить достижения" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Достижения</Text>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          sections.length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListHeaderComponent={
          total > 0 ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>
                {unlocked}/{total} достижений
              </Text>
              <ProgressBar current={unlocked} total={total} color={colors.accent.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="🏆"
            title="Нет достижений"
            subtitle="Начните тренироваться, чтобы получать награды"
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
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  listContent: { paddingHorizontal: SPACING[4], paddingBottom: SPACING[6], gap: SPACING[3] },
  emptyContainer: { flex: 1 },
  summaryCard: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[3],
    marginBottom: SPACING[2],
  },
  summaryText: {
    ...t.typography.h4,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
  },
  sectionHeader: {
    ...t.typography.h4,
    color: t.colors.text.primary,
    marginTop: SPACING[2],
  },
  card: {
    flexDirection: 'row' as const,
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[3],
    alignItems: 'flex-start' as const,
  },
  cardMuted: { opacity: 0.55 },
  cardIcon: { fontSize: 36, lineHeight: 40 },
  cardContent: { flex: 1, gap: SPACING[1] },
  cardTitle: {
    ...t.typography.body,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  cardDesc: { ...t.typography.bodySm, color: t.colors.text.secondary },
  cardDate: { ...t.typography.caption, color: t.colors.accent.primary, marginTop: SPACING[1] },
  textMuted: { color: t.colors.text.tertiary },
  progressRow: { gap: SPACING[1], marginTop: SPACING[1] },
  progressText: { ...t.typography.caption, color: t.colors.text.secondary },
  progressTextMuted: { ...t.typography.caption, color: t.colors.text.tertiary },
}));
