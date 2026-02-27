import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Badge, SegmentedControl, Skeleton, ErrorState, EmptyState } from '@/shared/ui';
import { useScreenView } from '@/features/analytics/tracker';
import { useMyBookings } from '@/features/booking/hooks';
import {
  formatBookingDateTime,
  getBookingStatusText,
  getBookingStatusColor,
  getServiceTypeBadgeVariant,
  getServiceTypeLabel,
} from '@/features/booking/utils';
import { SPACING } from '@/shared/theme/types';
import type { Booking } from '@/features/booking/types';

const SEGMENTS = ['Предстоящие', 'Прошедшие'];

export default function MyScheduleScreen() {
  useScreenView('client_my_schedule');

  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();

  const { data: bookings, isLoading, isError, refetch, isRefetching } = useMyBookings();

  const upcoming = (bookings ?? []).filter(
    (b) => b.status === 'confirmed' || b.status === 'waitlist',
  );
  const past = (bookings ?? []).filter(
    (b) => b.status === 'completed' || b.status === 'cancelled',
  );

  const currentList = tabIndex === 0 ? upcoming : past;

  const handleBookingPress = useCallback(
    (bookingId: string) => {
      router.push(`/(client)/(schedule)/${bookingId}`);
    },
    [router],
  );

  const renderBookingCard = useCallback(
    ({ item }: { item: Booking }) => {
      const statusText = getBookingStatusText(item.status);
      const statusColor = getBookingStatusColor(item.status);
      const badgeVariant = getServiceTypeBadgeVariant(item.serviceType) as
        | 'info'
        | 'accent'
        | 'warning';
      const dateTime = formatBookingDateTime(item.date, item.startTime, item.endTime);
      const isCancelled = item.status === 'cancelled';

      return (
        <Pressable
          onPress={() => handleBookingPress(item.id)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.cardHeader}>
            <Badge
              text={getServiceTypeLabel(item.serviceType)}
              variant={badgeVariant}
            />
            <View style={styles.statusRow}>
              {item.status === 'confirmed' && (
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              )}
              {item.status === 'waitlist' && (
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              )}
              {item.status === 'completed' && (
                <Text style={[styles.statusIcon, { color: statusColor }]}>{'✓'}</Text>
              )}
              <Text
                style={[
                  styles.statusText,
                  { color: statusColor },
                  isCancelled && styles.cancelledText,
                ]}
              >
                {statusText}
              </Text>
            </View>
          </View>

          <Text
            style={[styles.cardTitle, isCancelled && styles.cancelledTitle]}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text style={styles.cardDateTime}>{dateTime}</Text>

          <View style={styles.cardFooter}>
            <Text style={styles.cardMeta}>{item.trainerName}</Text>
            <Text style={styles.cardMetaSep}>{'·'}</Text>
            <Text style={styles.cardMeta}>{item.room}</Text>
          </View>
        </Pressable>
      );
    },
    [handleBookingPress, styles],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerSection}>
          <Text style={styles.heading}>Мое расписание</Text>
          <SegmentedControl segments={SEGMENTS} selectedIndex={tabIndex} onSelect={setTabIndex} />
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
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerSection}>
          <Text style={styles.heading}>Мое расписание</Text>
        </View>
        <ErrorState message="Не удалось загрузить записи" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.headerSection}>
        <Text style={styles.heading}>Мое расписание</Text>
        <SegmentedControl segments={SEGMENTS} selectedIndex={tabIndex} onSelect={setTabIndex} />
      </View>

      <FlatList
        data={currentList}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingCard}
        contentContainerStyle={[
          styles.listContent,
          currentList.length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title={tabIndex === 0 ? 'Нет записей' : 'Нет прошедших записей'}
            subtitle={
              tabIndex === 0
                ? 'Запишитесь на тренировку в разделе расписания'
                : 'Здесь будут отображаться завершенные и отмененные записи'
            }
          />
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
  headerSection: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[3],
    paddingBottom: SPACING[4],
    gap: SPACING[4],
  },
  heading: {
    ...t.typography.h2,
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
  card: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[2],
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  statusRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[1],
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: t.radius.full,
  },
  statusIcon: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  statusText: {
    ...t.typography.caption,
    fontWeight: '500' as const,
  },
  cancelledText: {
    textDecorationLine: 'line-through' as const,
  },
  cardTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  cancelledTitle: {
    textDecorationLine: 'line-through' as const,
    color: t.colors.text.tertiary,
  },
  cardDateTime: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  cardFooter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[1],
  },
  cardMeta: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  cardMetaSep: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
}));
