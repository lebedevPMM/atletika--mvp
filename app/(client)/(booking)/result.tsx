import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Button, Card, Badge, Skeleton, ErrorState } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useBooking } from '@/features/booking/hooks';
import { formatSlotTime, formatDate } from '@/features/booking/utils';
import { SPACING } from '@/shared/theme/types';
import type { Booking } from '@/features/booking/types';

export default function BookingResultScreen() {
  useScreenView('client_booking_result');

  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const { data: booking, isLoading, isError, refetch } = useBooking(bookingId);

  const isWaitlist = booking?.status === 'waitlist';

  // Celebration haptic on mount
  useEffect(() => {
    haptic.success();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatBookingTime = (b: Booking) =>
    `${b.startTime} – ${b.endTime}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {isError ? (
        <ErrorState message="Не удалось загрузить данные" onRetry={refetch} />
      ) : isLoading || !booking ? (
        <View style={styles.loadingContainer}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
      ) : (
        <View style={styles.container}>
          {/* Celebration section */}
          <View style={styles.celebrationSection}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationTitle}>
              {isWaitlist ? 'Вы в листе ожидания' : 'Вы записаны!'}
            </Text>
          </View>

          {/* Booking info card */}
          <Card style={styles.infoCard}>
            <Text style={styles.bookingTitle}>{booking.title}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Дата</Text>
              <Text style={styles.infoValue}>{formatDate(booking.date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Время</Text>
              <Text style={styles.infoValue}>{formatBookingTime(booking)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Тренер</Text>
              <Text style={styles.infoValue}>{booking.trainerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Зал</Text>
              <Text style={styles.infoValue}>{booking.room}</Text>
            </View>
            <View style={styles.statusRow}>
              <Badge
                text={isWaitlist ? 'Лист ожидания' : 'Подтверждено'}
                variant={isWaitlist ? 'warning' : 'success'}
              />
            </View>
          </Card>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Button
              title="Добавить в календарь"
              onPress={() => {
                haptic.light();
                // No-op for MVP
              }}
              variant="secondary"
              style={styles.actionButton}
            />
            <Button
              title="На главную"
              onPress={() => router.replace('/(client)/(home)' as never)}
              variant="primary"
              style={styles.actionButton}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  loadingContainer: {
    flex: 1,
    padding: SPACING[4],
    gap: SPACING[3],
    justifyContent: 'center' as const,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING[4],
    justifyContent: 'center' as const,
    gap: SPACING[6],
  },
  celebrationSection: {
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  celebrationEmoji: {
    fontSize: 72,
    textAlign: 'center' as const,
  },
  celebrationTitle: {
    ...t.typography.h1,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
  },
  infoCard: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  bookingTitle: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '700' as const,
    marginBottom: SPACING[1],
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  infoLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  infoValue: {
    ...t.typography.body,
    color: t.colors.text.primary,
    fontWeight: '500' as const,
  },
  statusRow: {
    marginTop: SPACING[2],
    paddingTop: SPACING[3],
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
    alignItems: 'center' as const,
  },
  actions: {
    gap: SPACING[3],
  },
  actionButton: {
    width: '100%' as unknown as number,
  },
}));
