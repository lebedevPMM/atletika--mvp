import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Skeleton, ErrorState, EmptyState, Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useNotifications, useMarkRead, useMarkAllRead } from '@/features/notifications/hooks';
import { getNotificationTypeLabel, getNotificationIcon, formatNewsDate } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';
import type { NotificationItem } from '@/features/club/types';

export default function NotificationsScreen() {
  useScreenView('client_notifications');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: notifications, isLoading, isError, refetch, isRefetching } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;

  const handleNotificationPress = useCallback(
    (item: NotificationItem) => {
      haptic.selection();
      if (!item.isRead) {
        markRead.mutate(item.id);
      }
    },
    [haptic, markRead],
  );

  const handleMarkAllRead = useCallback(() => {
    haptic.success();
    markAllRead.mutate();
  }, [haptic, markAllRead]);

  const renderNotification = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <Pressable
        onPress={() => handleNotificationPress(item)}
        style={({ pressed }) => [
          styles.notifCard,
          !item.isRead && styles.notifCardUnread,
          pressed && styles.notifCardPressed,
        ]}
      >
        <Text style={styles.notifIcon}>{getNotificationIcon(item.type)}</Text>
        <View style={styles.notifContent}>
          <View style={styles.notifHeader}>
            <Text style={styles.notifType}>{getNotificationTypeLabel(item.type)}</Text>
            <Text style={styles.notifTime}>{formatNewsDate(item.createdAt)}</Text>
          </View>
          <Text style={[styles.notifTitle, !item.isRead && styles.notifTitleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </Pressable>
    ),
    [handleNotificationPress, styles],
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
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.markAllRow}>
          <Button
            title="Прочитать все"
            onPress={handleMarkAllRead}
            variant="secondary"
            loading={markAllRead.isPending}
          />
        </View>
      )}

      <FlatList
        data={notifications ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={[
          styles.listContent,
          (notifications ?? []).length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={
          <EmptyState icon="🔔" title="Нет уведомлений" subtitle="Здесь появятся уведомления о записях и акциях" />
        }
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
    flex: 1,
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
  headerBadge: {
    backgroundColor: t.colors.semantic.error.main,
    borderRadius: t.radius.full,
    minWidth: 24,
    height: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: SPACING[2],
  },
  headerBadgeText: {
    ...t.typography.caption,
    color: '#FFFFFF',
    fontWeight: '700' as const,
  },
  markAllRow: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[3],
  },
  skeletonList: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  listContent: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[6],
    gap: SPACING[2],
  },
  emptyContainer: {
    flex: 1,
  },
  notifCard: {
    flexDirection: 'row' as const,
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[3],
    position: 'relative' as const,
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: t.colors.accent.primary,
  },
  notifCardPressed: {
    opacity: 0.85,
  },
  notifIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  notifContent: {
    flex: 1,
    gap: SPACING[1],
  },
  notifHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  notifType: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  notifTime: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  notifTitle: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  notifTitleUnread: {
    fontWeight: '600' as const,
  },
  notifBody: {
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
