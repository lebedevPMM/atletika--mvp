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
  Skeleton,
  EmptyState,
  ErrorState,
  FilterChips,
  SlotCard,
} from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useSchedule } from '@/features/booking/hooks';
import { generateWeekDates } from '@/features/booking/utils';
import type { ScheduleSlot } from '@/features/booking/types';

const LEVEL_CHIPS = [
  { label: 'Все', value: 'all' },
  { label: 'Начинающий', value: 'beginner' },
  { label: 'Средний', value: 'intermediate' },
  { label: 'Продвинутый', value: 'advanced' },
];

export default function GroupsBrowseScreen() {
  useScreenView('client_booking_groups');

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const weekDates = useMemo(() => generateWeekDates(), []);

  const [selectedDate, setSelectedDate] = useState(weekDates[0].date);
  const [selectedLevel, setSelectedLevel] = useState<string | null>('all');

  const {
    data: slots,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useSchedule({
    date: selectedDate,
    serviceType: 'group',
  });

  // Filter by level client-side
  const filteredSlots = useMemo(() => {
    if (!slots) return [];
    if (!selectedLevel || selectedLevel === 'all') return slots;
    return slots.filter((s) => s.level === selectedLevel);
  }, [slots, selectedLevel]);

  const handleDateSelect = useCallback(
    (date: string) => {
      haptic.selection();
      setSelectedDate(date);
    },
    [haptic],
  );

  const handleSlotPress = useCallback(
    (slot: ScheduleSlot) => {
      router.push(`/(client)/(booking)/class/${slot.id}` as never);
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
        <Pressable
          onPress={() => {
            haptic.selection();
            router.back();
          }}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.heading}>Групповые занятия</Text>
      </View>

      {/* Level filter chips */}
      <View style={styles.filterRow}>
        <FilterChips
          chips={LEVEL_CHIPS}
          selected={selectedLevel}
          onSelect={setSelectedLevel}
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
          data={filteredSlots}
          renderItem={renderSlot}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState
              icon="📅"
              title="Нет групповых занятий"
              subtitle="Попробуйте выбрать другой день или уровень"
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
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
    ...t.typography.h2,
    color: t.colors.text.primary,
    flex: 1,
  },
  filterRow: {
    marginBottom: 8,
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
