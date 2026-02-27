import { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Card, Button, Skeleton, ErrorState } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useSchedule, useRescheduleBooking } from '@/features/booking/hooks';
import {
  formatDate,
  generateWeekDates,
  getAvailableSpots,
  formatBookingDateTime,
} from '@/features/booking/utils';
import { SPACING } from '@/shared/theme/types';
import type { ScheduleSlot, ServiceType } from '@/features/booking/types';

type RescheduleParams = {
  bookingId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerName: string;
  serviceType: string;
};

export default function RescheduleBookingScreen() {
  useScreenView('client_booking_reschedule');

  const params = useLocalSearchParams<RescheduleParams>();
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  // Two weeks of dates: this week + next week
  const weekDates = useMemo(() => {
    const thisWeek = generateWeekDates();
    const nextWeekStart = new Date();
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const nextWeek = generateWeekDates(nextWeekStart);
    return [...thisWeek, ...nextWeek];
  }, []);

  const [selectedDate, setSelectedDate] = useState(weekDates[0]?.date ?? '');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const serviceType = (params.serviceType ?? 'group') as ServiceType;

  const {
    data: slots,
    isLoading: slotsLoading,
    isError: slotsError,
    refetch,
  } = useSchedule({ date: selectedDate, serviceType });

  const rescheduleBooking = useRescheduleBooking();

  // Filter out current slot from available slots
  const availableSlots = useMemo(() => {
    if (!slots) return [];
    return slots.filter((s) => {
      // Exclude the slot the user already has booked
      const isSameSlot =
        s.date === params.date &&
        s.startTime === params.startTime &&
        s.endTime === params.endTime;
      return !isSameSlot;
    });
  }, [slots, params.date, params.startTime, params.endTime]);

  const dateTimeFormatted = formatBookingDateTime(
    params.date ?? '',
    params.startTime ?? '',
    params.endTime ?? '',
  );

  const handleBack = useCallback(() => {
    haptic.selection();
    router.back();
  }, [haptic, router]);

  const handleDateSelect = useCallback(
    (date: string) => {
      haptic.selection();
      setSelectedDate(date);
      setSelectedSlotId(null);
    },
    [haptic],
  );

  const handleSlotSelect = useCallback(
    (slotId: string) => {
      haptic.selection();
      setSelectedSlotId(slotId === selectedSlotId ? null : slotId);
    },
    [haptic, selectedSlotId],
  );

  const handleConfirmReschedule = useCallback(async () => {
    if (!params.bookingId || !selectedSlotId) return;

    try {
      await rescheduleBooking.mutateAsync({
        bookingId: params.bookingId,
        newSlotId: selectedSlotId,
      });
      haptic.success();
      Alert.alert('Готово', 'Запись успешно перенесена', [
        {
          text: 'OK',
          onPress: () => {
            router.dismissAll();
            router.replace('/(client)/(schedule)/');
          },
        },
      ]);
    } catch (error) {
      haptic.error();
      Alert.alert(
        'Ошибка',
        error instanceof Error ? error.message : 'Не удалось перенести запись',
      );
    }
  }, [params.bookingId, selectedSlotId, rescheduleBooking, haptic, router]);

  const renderSlotCard = useCallback(
    ({ item }: { item: ScheduleSlot }) => {
      const spots = getAvailableSpots(item);
      const isFull = item.isFull;
      const isSelected = selectedSlotId === item.id;

      return (
        <Pressable
          onPress={() => !isFull && handleSlotSelect(item.id)}
          style={[
            styles.slotCard,
            isFull && styles.slotCardDisabled,
            isSelected && { borderColor: colors.accent.primary, borderWidth: 2 },
          ]}
          disabled={isFull}
        >
          <View style={styles.slotCardHeader}>
            <Text style={[styles.slotTime, isFull && styles.slotTextDisabled]}>
              {item.startTime} – {item.endTime}
            </Text>
            {isSelected && (
              <Text style={[styles.selectedBadge, { color: colors.accent.primary }]}>
                {'✓'}
              </Text>
            )}
          </View>
          <Text style={[styles.slotRoom, isFull && styles.slotTextDisabled]}>
            {item.room}
          </Text>
          <Text
            style={[
              styles.slotSpots,
              isFull && styles.slotTextDisabled,
              spots <= 2 && !isFull && styles.slotSpotsLow,
            ]}
          >
            {isFull ? 'Мест нет' : `Свободно мест: ${spots}`}
          </Text>
        </Pressable>
      );
    },
    [selectedSlotId, handleSlotSelect, styles, colors],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Перенос записи</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current booking summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{params.title}</Text>
          <Text style={styles.summaryDateTime}>{dateTimeFormatted}</Text>
          <Text style={styles.summaryTrainer}>{params.trainerName}</Text>
        </Card>

        {/* Section: pick new time */}
        <Text style={styles.sectionTitle}>Выберите новое время</Text>

        {/* Horizontal date picker */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datePickerContent}
        >
          {weekDates.map((d) => {
            const isActive = selectedDate === d.date;
            return (
              <Pressable
                key={d.date}
                onPress={() => handleDateSelect(d.date)}
                style={[
                  styles.dateChip,
                  isActive && { backgroundColor: colors.accent.primary },
                ]}
              >
                <Text
                  style={[
                    styles.dateChipText,
                    isActive && { color: colors.text.inverse },
                  ]}
                >
                  {d.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Slots for selected date */}
        {slotsLoading ? (
          <View style={styles.slotsLoading}>
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </View>
        ) : slotsError ? (
          <ErrorState message="Не удалось загрузить расписание" onRetry={refetch} />
        ) : availableSlots.length === 0 ? (
          <View style={styles.emptySlots}>
            <Text style={styles.emptySlotsText}>Нет доступных слотов на эту дату</Text>
          </View>
        ) : (
          <View style={styles.slotsList}>
            {availableSlots.map((slot) => (
              <View key={slot.id}>{renderSlotCard({ item: slot })}</View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Confirm button */}
      <View style={styles.bottomBar}>
        <Button
          title="Подтвердить перенос"
          onPress={handleConfirmReschedule}
          disabled={!selectedSlotId}
          loading={rescheduleBooking.isPending}
        />
      </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING[4],
    gap: SPACING[5],
    paddingBottom: SPACING[6],
  },
  summaryCard: {
    padding: SPACING[4],
    gap: SPACING[2],
    backgroundColor: t.colors.bg.surface,
  },
  summaryTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  summaryDateTime: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  summaryTrainer: {
    ...t.typography.bodySm,
    color: t.colors.text.tertiary,
  },
  sectionTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  datePickerContent: {
    gap: SPACING[2],
    paddingVertical: SPACING[1],
  },
  dateChip: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.bg.elevated,
    borderWidth: 1,
    borderColor: t.colors.border.default,
  },
  dateChipText: {
    ...t.typography.bodySm,
    color: t.colors.text.primary,
  },
  slotsLoading: {
    gap: SPACING[3],
  },
  slotsList: {
    gap: SPACING[3],
  },
  slotCard: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[1],
    borderWidth: 1,
    borderColor: t.colors.border.default,
  },
  slotCardDisabled: {
    opacity: 0.5,
  },
  slotCardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  slotTime: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  slotTextDisabled: {
    color: t.colors.text.tertiary,
  },
  selectedBadge: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  slotRoom: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  slotSpots: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  slotSpotsLow: {
    color: t.colors.semantic.warning.main,
  },
  emptySlots: {
    padding: SPACING[6],
    alignItems: 'center' as const,
  },
  emptySlotsText: {
    ...t.typography.body,
    color: t.colors.text.tertiary,
    textAlign: 'center' as const,
  },
  bottomBar: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
  },
}));
