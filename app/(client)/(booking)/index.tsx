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
import {
  SegmentedControl,
  Skeleton,
  EmptyState,
  ErrorState,
  SlotCard,
} from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useSchedule } from '@/features/booking/hooks';
import { generateWeekDates } from '@/features/booking/utils';
import type { ScheduleSlot, ServiceType } from '@/features/booking/types';

const SEGMENTS = ['Все', 'Группы', 'ПТ', 'SPA'] as const;
const SEGMENT_TO_TYPE: Array<ServiceType | undefined> = [undefined, 'group', 'pt', 'spa'];

export default function BookingBrowseScreen() {
  useScreenView('client_booking_browse');

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const weekDates = useMemo(() => generateWeekDates(), []);

  const [segmentIndex, setSegmentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(weekDates[0].date);

  const selectedType = SEGMENT_TO_TYPE[segmentIndex];

  const {
    data: slots,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useSchedule({
    date: selectedDate,
    serviceType: selectedType,
  });

  const handleDateSelect = useCallback(
    (date: string) => {
      haptic.selection();
      setSelectedDate(date);
    },
    [haptic],
  );

  const handleSlotPress = useCallback(
    (slot: ScheduleSlot) => {
      const route =
        slot.serviceType === 'group'
          ? `/(client)/(booking)/class/${slot.id}`
          : slot.serviceType === 'pt'
            ? `/(client)/(booking)/pt/${slot.id}`
            : `/(client)/(booking)/spa/${slot.id}`;
      router.push(route as never);
    },
    [router],
  );

  const renderSlot = useCallback(
    ({ item }: { item: ScheduleSlot }) => (
      <SlotCard slot={item} onPress={handleSlotPress} />
    ),
    [handleSlotPress],
  );

  const keyExtractor = useCallback((item: ScheduleSlot) => item.id, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Расписание</Text>
      </View>

      {/* Segment control */}
      <View style={styles.segmentWrap}>
        <SegmentedControl
          segments={[...SEGMENTS]}
          selectedIndex={segmentIndex}
          onSelect={setSegmentIndex}
        />
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
              icon="📅"
              title="Нет занятий на выбранную дату"
              subtitle="Попробуйте выбрать другой день или тип занятий"
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  heading: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  segmentWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  weekStrip: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
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
    padding: 16,
    gap: 12,
  },
  list: {
    padding: 16,
    paddingTop: 4,
    flexGrow: 1,
  },
  separator: {
    height: 10,
  },
}));
