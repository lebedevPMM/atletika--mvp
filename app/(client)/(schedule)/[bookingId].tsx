import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { Badge, Card, Skeleton, ErrorState, Button } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useBooking } from '@/features/booking/hooks';
import {
  formatDate,
  formatPrice,
  getBookingStatusText,
  getBookingStatusColor,
  getServiceTypeBadgeVariant,
  getServiceTypeLabel,
  getBookingStatusBadgeVariant,
  isCancelDeadlinePassed,
} from '@/features/booking/utils';
import { SPACING } from '@/shared/theme/types';
import type { Booking } from '@/features/booking/types';

export default function ScheduleBookingDetailScreen() {
  useScreenView('client_booking_detail');

  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const styles = useStyles();
  const haptic = useHaptic();

  const { data: booking, isLoading, isError, refetch } = useBooking(bookingId ?? '');

  const handleBack = useCallback(() => {
    haptic.selection();
    router.back();
  }, [haptic, router]);

  const handleCancel = useCallback(() => {
    if (!booking) return;
    haptic.selection();
    router.push({
      pathname: '/(client)/(schedule)/cancel',
      params: {
        bookingId: booking.id,
        title: booking.title,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        trainerName: booking.trainerName,
        cancelDeadline: booking.cancelDeadline ?? '',
      },
    });
  }, [booking, haptic, router]);

  const handleReschedule = useCallback(() => {
    if (!booking) return;
    haptic.selection();
    router.push({
      pathname: '/(client)/(schedule)/reschedule',
      params: {
        bookingId: booking.id,
        title: booking.title,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        trainerName: booking.trainerName,
        serviceType: booking.serviceType,
      },
    });
  }, [booking, haptic, router]);

  const handleWaitlistDetails = useCallback(() => {
    if (!booking) return;
    haptic.selection();
    router.push({
      pathname: '/(client)/(schedule)/waitlist',
      params: {
        bookingId: booking.id,
        title: booking.title,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        trainerName: booking.trainerName,
      },
    });
  }, [booking, haptic, router]);

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

  const statusText = getBookingStatusText(booking.status);
  const statusColor = getBookingStatusColor(booking.status);
  const badgeVariant = getServiceTypeBadgeVariant(booking.serviceType) as
    | 'info'
    | 'accent'
    | 'warning';
  const statusBadgeVariant = getBookingStatusBadgeVariant(booking.status);
  const formatBookingTime = (b: Booking) => `${b.startTime}\u2013${b.endTime}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Назад</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + Service Badge */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{booking.title}</Text>
          <Badge
            text={getServiceTypeLabel(booking.serviceType)}
            variant={badgeVariant}
          />
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
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Статус</Text>
            <Badge text={statusText} variant={statusBadgeVariant} />
          </View>
        </Card>

        {/* Confirmed actions */}
        {booking.status === 'confirmed' && (
          <View style={styles.actionsSection}>
            <Button
              title="Отменить запись"
              onPress={handleCancel}
              variant="danger"
            />
            <Button
              title="Перенести"
              onPress={handleReschedule}
              variant="secondary"
            />
          </View>
        )}

        {/* Waitlist info */}
        {booking.status === 'waitlist' && (
          <View style={styles.statusInfoSection}>
            <Pressable onPress={handleWaitlistDetails}>
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxText}>
                  Вы в листе ожидания. Мы уведомим вас при появлении места.
                </Text>
                <Text style={styles.infoBoxLink}>Подробнее</Text>
              </View>
            </Pressable>
            <Button
              title="Покинуть очередь"
              onPress={handleCancel}
              variant="secondary"
            />
          </View>
        )}

        {/* Cancelled info */}
        {booking.status === 'cancelled' && (
          <View style={styles.statusInfoSection}>
            <View style={[styles.infoBox, styles.infoBoxGrey]}>
              <Text style={[styles.infoBoxText, styles.infoBoxTextGrey]}>
                Запись отменена
              </Text>
            </View>
          </View>
        )}

        {/* Completed info */}
        {booking.status === 'completed' && (
          <View style={styles.statusInfoSection}>
            <View style={[styles.infoBox, styles.infoBoxGreen]}>
              <Text style={[styles.infoBoxText, styles.infoBoxTextGreen]}>
                Тренировка завершена
              </Text>
            </View>
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
  headerTitle: {
    ...t.typography.body,
    color: t.colors.text.primary,
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
  actionsSection: {
    gap: SPACING[3],
  },
  statusInfoSection: {
    gap: SPACING[3],
  },
  infoBox: {
    backgroundColor: t.colors.semantic.warning.surface,
    borderRadius: t.radius.md,
    padding: SPACING[4],
  },
  infoBoxText: {
    ...t.typography.bodySm,
    color: t.colors.semantic.warning.main,
    textAlign: 'center' as const,
  },
  infoBoxLink: {
    ...t.typography.bodySm,
    color: t.colors.accent.primary,
    textAlign: 'center' as const,
    marginTop: SPACING[2],
    fontWeight: '500' as const,
  },
  infoBoxGrey: {
    backgroundColor: t.colors.bg.surface,
  },
  infoBoxTextGrey: {
    color: t.colors.text.tertiary,
  },
  infoBoxGreen: {
    backgroundColor: t.colors.semantic.success.surface,
  },
  infoBoxTextGreen: {
    color: t.colors.semantic.success.main,
  },
}));
