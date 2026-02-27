import { useCallback, useMemo } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';
import { useScreenView } from '@/features/analytics/tracker';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useTrainerNotifications, useReadAllTrainerNotifications } from '@/features/trainer/hooks';
import { Skeleton, ErrorState, EmptyState } from '@/shared/ui';
import type { TrainerNotification } from '@/features/trainer/types';

type SectionItem =
  | { type: 'header'; title: string }
  | { type: 'notification'; data: TrainerNotification };

function getNotificationTypeIcon(type: TrainerNotification['type']): string {
  switch (type) {
    case 'cancellation': return '\u274C';
    case 'new_booking': return '\uD83D\uDCD7';
    case 'schedule_change': return '\uD83D\uDD04';
    case 'report': return '\uD83D\uDCCA';
    case 'system': return '\u2699\uFE0F';
  }
}

function getDateGroup(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (itemDate.getTime() === today.getTime()) return 'Сегодня';
  if (itemDate.getTime() === yesterday.getTime()) return 'Вчера';
  return 'Ранее';
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export default function TrainerNotificationsScreen() {
  useScreenView('trainer_notifications');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: notifications, isLoading, isError, refetch, isRefetching } = useTrainerNotifications();
  const readAll = useReadAllTrainerNotifications();

  const unreadCount = useMemo(
    () => (notifications ?? []).filter((n) => !n.read).length,
    [notifications],
  );

  const sectionData = useMemo<SectionItem[]>(() => {
    if (!notifications) return [];
    const groups: Record<string, TrainerNotification[]> = {};
    const order = ['Сегодня', 'Вчера', 'Ранее'];

    for (const n of notifications) {
      const group = getDateGroup(n.time);
      if (!groups[group]) groups[group] = [];
      groups[group].push(n);
    }

    const result: SectionItem[] = [];
    for (const group of order) {
      if (groups[group]?.length) {
        result.push({ type: 'header', title: group });
        for (const n of groups[group]) {
          result.push({ type: 'notification', data: n });
        }
      }
    }
    return result;
  }, [notifications]);

  const handleReadAll = useCallback(() => {
    haptic.medium();
    readAll.mutate();
  }, [haptic, readAll]);

  const renderItem = useCallback(
    ({ item }: { item: SectionItem }) => {
      if (item.type === 'header') {
        return <Text style={styles.sectionHeader}>{item.title}</Text>;
      }

      const n = item.data;
      return (
        <Pressable
          style={({ pressed }) => [styles.notifCard, pressed && styles.notifCardPressed]}
        >
          <View style={styles.notifIconWrap}>
            <Text style={styles.notifIcon}>{getNotificationTypeIcon(n.type)}</Text>
          </View>
          <View style={styles.notifContent}>
            <View style={styles.notifTitleRow}>
              <Text style={[styles.notifTitle, !n.read && styles.notifTitleUnread]} numberOfLines={1}>
                {n.title}
              </Text>
              {!n.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notifBody} numberOfLines={2}>{n.body}</Text>
            <Text style={styles.notifTime}>{formatTime(n.time)}</Text>
          </View>
        </Pressable>
      );
    },
    [styles],
  );

  const keyExtractor = useCallback(
    (item: SectionItem, index: number) =>
      item.type === 'header' ? `header-${item.title}` : item.data.id,
    [],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Уведомления</Text>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="list" />
          <Skeleton variant="list" />
          <Skeleton variant="list" />
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
          <Text style={styles.headerTitle}>Уведомления</Text>
        </View>
        <ErrorState message="Не удалось загрузить уведомления" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Уведомления</Text>
        {unreadCount > 0 && (
          <Pressable onPress={handleReadAll} style={styles.readAllBtn}>
            <Text style={styles.readAllText}>Прочитать все</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={sectionData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, sectionData.length === 0 && styles.emptyContainer]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon={'\uD83D\uDD14'}
            title="Нет уведомлений"
            subtitle="Здесь появятся уведомления о записях, отменах и расписании"
          />
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
  headerTitle: { ...t.typography.h3, color: t.colors.text.primary, flex: 1 },
  backBtn: {
    width: 40, height: 40, borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated, alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  backText: { fontSize: 20, color: t.colors.text.primary },
  readAllBtn: { paddingVertical: SPACING[1], paddingHorizontal: SPACING[2] },
  readAllText: { ...t.typography.bodySm, color: t.colors.accent.primary, fontWeight: '600' as const },
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  listContent: { paddingHorizontal: SPACING[4], paddingBottom: SPACING[6] },
  emptyContainer: { flex: 1 },
  sectionHeader: {
    ...t.typography.overline, color: t.colors.text.tertiary,
    marginTop: SPACING[4], marginBottom: SPACING[2],
    textTransform: 'uppercase' as const, letterSpacing: 1,
  },
  notifCard: {
    flexDirection: 'row' as const, backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg, padding: SPACING[3], gap: SPACING[3],
    marginBottom: SPACING[2],
  },
  notifCardPressed: { opacity: 0.85 },
  notifIconWrap: {
    width: 40, height: 40, borderRadius: t.radius.md,
    backgroundColor: t.colors.bg.surface, alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  notifIcon: { fontSize: 18 },
  notifContent: { flex: 1, gap: SPACING[1] },
  notifTitleRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: SPACING[2] },
  notifTitle: { ...t.typography.body, color: t.colors.text.primary, flex: 1 },
  notifTitleUnread: { fontWeight: '700' as const },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: t.colors.accent.primary,
  },
  notifBody: { ...t.typography.bodySm, color: t.colors.text.secondary },
  notifTime: { ...t.typography.caption, color: t.colors.text.tertiary },
}));
