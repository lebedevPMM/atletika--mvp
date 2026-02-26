import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Card, Badge, Skeleton, EmptyState, ErrorState } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useSchedule } from '@/features/booking/hooks';
import {
  generateWeekDates,
  formatSlotTime,
  formatPrice,
  getAvailableSpots,
} from '@/features/booking/utils';
import type { ScheduleSlot } from '@/features/booking/types';
import { pluralize } from '@/shared/lib/pluralize';
import { SPACING } from '@/shared/theme/types';

export default function PTBrowseScreen() {
  useScreenView('client_pt_browse');

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const weekDates = useMemo(() => generateWeekDates(), []);
  const [selectedDate, setSelectedDate] = useState(weekDates[0].date);

  const {
    data: slots,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useSchedule({ date: selectedDate, serviceType: 'pt' });

  const handleDateSelect = useCallback(
    (date: string) => {
      haptic.selection();
      setSelectedDate(date);
    },
    [haptic],
  );

  const handleSlotPress = useCallback(
    (slot: ScheduleSlot) => {
      router.push(`/(client)/(booking)/pt/${slot.id}` as never);
    },
    [router],
  );

  const renderSlot = useCallback(
    ({ item }: { item: ScheduleSlot }) => {
      const spots = getAvailableSpots(item);
      return (
        <Card onPress={() => handleSlotPress(item)} style={styles.slotCard}>
          <View style={styles.slotRow}>
            <View style={styles.slotLeft}>
              <Text style={styles.trainerName}>{item.trainerName}</Text>
              <Text style={styles.slotTime}>{formatSlotTime(item)}</Text>
              <Text style={styles.slotMeta}>
                {item.room} · {spots}{' '}
                {pluralize(spots, ['место', 'места', 'мест'])}
              </Text>
            </View>
            <View style={styles.slotRight}>
              {item.price > 0 && (
                <Text style={styles.slotPrice}>
                  {formatPrice(item.price, item.currency)}
                </Text>
              )}
              {item.isFull && (
                <Badge
                  text={item.isWaitlistAvailable ? 'Лист ожидания' : 'Мест нет'}
                  variant={item.isWaitlistAvailable ? 'warning' : 'error'}
                />
              )}
            </View>
          </View>
        </Card>
      );
    },
    [handleSlotPress, styles],
  );

  const keyExtractor = useCallback((item: ScheduleSlot) => item.id, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            haptic.selection();
            router.back();
          }}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.heading}>Персональные тренировки</Text>
      </View>

      {/* Week date strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weekStrip}
      >
        {weekDates.map((day) => {
          const isActive = day.date === selectedDate;
          return (
            <Pressable
              key={day.date}
              onPress={() => handleDateSelect(day.date)}
              style={[
                styles.datePill,
                {
                  backgroundColor: isActive
                    ? colors.accent.primary
                    : colors.bg.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.datePillText,
                  {
                    color: isActive
                      ? colors.text.inverse
                      : colors.text.secondary,
                  },
                ]}
              >
                {day.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Content */}
      {isError ? (
        <ErrorState message="Не удалось загрузить расписание" onRetry={refetch} />
      ) : isLoading ? (
        <View style={styles.skeletons}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
      ) : (
        <FlatList
          data={slots ?? []}
          renderItem={renderSlot}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState
              icon="🏋️"
              title="Нет доступных тренировок"
              subtitle="Попробуйте выбрать другой день"
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.accent.primary}
            />
          }
        />
      )}
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
  heading: {
    ...t.typography.h3,
    color: t.colors.text.primary,
    flex: 1,
  },
  weekStrip: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[2],
    paddingBottom: SPACING[3],
  },
  datePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: t.radius.full,
  },
  datePillText: {
    ...t.typography.bodySm,
    fontWeight: '500' as const,
  },
  skeletons: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  list: {
    padding: SPACING[4],
    paddingTop: SPACING[1],
    flexGrow: 1,
  },
  separator: {
    height: SPACING[3],
  },
  slotCard: {
    padding: SPACING[4],
  },
  slotRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  slotLeft: {
    flex: 1,
    gap: 2,
  },
  trainerName: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  slotTime: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  slotMeta: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  slotRight: {
    alignItems: 'flex-end' as const,
    gap: SPACING[1],
    marginLeft: SPACING[3],
  },
  slotPrice: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
}));
