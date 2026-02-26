import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { Button, Card, Badge, Skeleton, ErrorState } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useBooking, useCancelBooking } from '@/features/booking/hooks';
import { formatDate, formatPrice } from '@/features/booking/utils';
import { SPACING } from '@/shared/theme/types';
import type { Booking } from '@/features/booking/types';

const STATUS_CONFIG: Record<Booking['status'], { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
  confirmed: { label: 'Подтверждено', variant: 'success' },
  waitlist: { label: 'Лист ожидания', variant: 'warning' },
  cancelled: { label: 'Отменено', variant: 'error' },
  completed: { label: 'Завершено', variant: 'info' },
};

export default function BookingDetailsScreen() {
  useScreenView('client_booking_details');

  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const styles = useStyles();
  const haptic = useHaptic();

  const { data: booking, isLoading, isError, refetch } = useBooking(bookingId ?? '');
  const cancelBooking = useCancelBooking();

  const handleBack = useCallback(() => {
    haptic.selection();
    router.back();
  }, [haptic, router]);

  const canCancel = useCallback((b: Booking): boolean => {
    if (b.status !== 'confirmed') return false;
    if (!b.cancelDeadline) return false;
    return new Date(b.cancelDeadline) > new Date();
  }, []);

  const handleCancel = useCallback(() => {
    if (!booking) return;
    Alert.alert(
      'Отменить запись?',
      `Вы уверены, что хотите отменить запись на "${booking.title}"?`,
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да, отменить',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking.mutateAsync({ bookingId: booking.id });
              haptic.success();
              router.back();
            } catch (error) {
              haptic.error();
              Alert.alert(
                'Ошибка',
                error instanceof Error ? error.message : 'Не удалось отменить запись',
              );
            }
          },
        },
      ],
    );
  }, [booking, cancelBooking, haptic, router]);

  const formatBookingTime = (b: Booking) => `${b.startTime} – ${b.endTime}`;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.backRow}>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
        </View>
        <View style={styles.skeletons}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !booking) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.backRow}>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
        </View>
        <ErrorState message="Не удалось загрузить запись" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const statusCfg = STATUS_CONFIG[booking.status];
  const showCancel = canCancel(booking);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.heading}>Запись</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + Badge */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{booking.title}</Text>
          <Badge text={statusCfg.label} variant={statusCfg.variant} />
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
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
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Стоимость</Text>
            <Text style={styles.priceValue}>
              {booking.price > 0
                ? formatPrice(booking.price, booking.currency)
                : 'Включено в абонемент'}
            </Text>
          </View>
        </Card>

        {/* Cancel button */}
        {showCancel && (
          <View style={styles.cancelSection}>
            <Button
              title="Отменить запись"
              onPress={handleCancel}
              variant="secondary"
              loading={cancelBooking.isPending}
              style={styles.cancelBtn}
            />
          </View>
        )}
      </ScrollView>
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
  backRow: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[1],
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING[4],
    gap: SPACING[5],
  },
  skeletons: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  titleSection: {
    gap: SPACING[2],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  infoCard: {
    padding: SPACING[4],
    gap: SPACING[3],
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
  priceRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: SPACING[2],
    paddingTop: SPACING[3],
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
  },
  priceLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  priceValue: {
    ...t.typography.h4,
    color: t.colors.accent.primary,
  },
  cancelSection: {
    marginTop: SPACING[2],
  },
  cancelBtn: {
    width: '100%' as unknown as number,
    borderColor: t.colors.semantic.error.main,
  },
}));
