import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Button, Card, Badge, Skeleton, ErrorState } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useSlot, useCreateBooking } from '@/features/booking/hooks';
import {
  formatSlotTime,
  formatDate,
  formatPrice,
  checkBookingEligibility,
} from '@/features/booking/utils';
import { useClubStore } from '@/features/club/store';
import { SPACING } from '@/shared/theme/types';

export default function BookingConfirmScreen() {
  useScreenView('client_booking_confirm');

  const { slotId, waitlist } = useLocalSearchParams<{
    slotId: string;
    waitlist?: string;
  }>();
  const isWaitlist = waitlist === 'true';

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const { data: slot, isLoading, isError, refetch } = useSlot(slotId);
  const createBooking = useCreateBooking();
  const cancelPolicyMinutes = useClubStore((s) => s.config?.cancelPolicyMinutes);

  const [submitting, setSubmitting] = useState(false);

  const eligibility = slot ? checkBookingEligibility(slot) : null;

  const handleConfirm = useCallback(async () => {
    if (!slot) return;
    setSubmitting(true);
    try {
      const result = await createBooking.mutateAsync({
        slotId: slot.id,
        serviceType: slot.serviceType,
        waitlist: isWaitlist,
      });
      haptic.success();
      router.replace({
        pathname: '/(client)/(booking)/result',
        params: { bookingId: result.id },
      } as never);
    } catch (error) {
      haptic.error();
      Alert.alert(
        'Ошибка',
        error instanceof Error ? error.message : 'Не удалось создать запись',
      );
    } finally {
      setSubmitting(false);
    }
  }, [slot, createBooking, isWaitlist, haptic, router]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
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
        <Text style={styles.heading}>Подтверждение записи</Text>
      </View>

      {/* Content */}
      {isError ? (
        <ErrorState message="Не удалось загрузить данные" onRetry={refetch} />
      ) : isLoading || !slot ? (
        <View style={styles.skeletons}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Summary Card */}
            <Card style={styles.summaryCard}>
              <Text style={styles.serviceTitle}>{slot.title}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Дата</Text>
                <Text style={styles.infoValue}>{formatDate(slot.date)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Время</Text>
                <Text style={styles.infoValue}>{formatSlotTime(slot)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Тренер</Text>
                <Text style={styles.infoValue}>{slot.trainerName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Зал</Text>
                <Text style={styles.infoValue}>{slot.room}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  {slot.price > 0
                    ? formatPrice(slot.price, slot.currency)
                    : 'Включено в абонемент'}
                </Text>
              </View>
            </Card>

            {/* Cancel Policy Warning */}
            {cancelPolicyMinutes != null && (
              <Card style={styles.warningCard}>
                <View style={styles.warningRow}>
                  <Text style={styles.warningIcon}>⚠️</Text>
                  <Text style={styles.warningText}>
                    Бесплатная отмена за {cancelPolicyMinutes} минут до начала
                  </Text>
                </View>
              </Card>
            )}

            {/* Eligibility warning */}
            {eligibility && !eligibility.eligible && (
              <Card style={styles.errorCard}>
                <Text style={styles.errorText}>{eligibility.reason}</Text>
              </Card>
            )}
          </ScrollView>

          {/* Bottom fixed section */}
          <View style={styles.bottomSection}>
            {isWaitlist && (
              <View style={styles.waitlistBadge}>
                <Badge text="Лист ожидания" variant="warning" />
              </View>
            )}
            <Button
              title="Подтвердить запись"
              onPress={handleConfirm}
              variant="primary"
              loading={submitting}
              disabled={eligibility != null && !eligibility.eligible}
              style={styles.ctaButton}
            />
          </View>
        </>
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
    ...t.typography.h2,
    color: t.colors.text.primary,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  skeletons: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  summaryCard: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  serviceTitle: {
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
  priceRow: {
    marginTop: SPACING[2],
    paddingTop: SPACING[3],
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
  },
  priceLabel: {
    ...t.typography.h4,
    color: t.colors.accent.primary,
  },
  warningCard: {
    padding: SPACING[3],
    backgroundColor: t.colors.semantic.warning.surface,
  },
  warningRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[2],
  },
  warningIcon: {
    fontSize: 18,
  },
  warningText: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    flex: 1,
  },
  errorCard: {
    padding: SPACING[3],
    backgroundColor: t.colors.semantic.error.surface,
  },
  errorText: {
    ...t.typography.bodySm,
    color: t.colors.semantic.error.main,
    textAlign: 'center' as const,
  },
  bottomSection: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[4],
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
    gap: SPACING[3],
  },
  waitlistBadge: {
    alignItems: 'center' as const,
  },
  ctaButton: {
    width: '100%' as unknown as number,
  },
}));
