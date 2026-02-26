import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Button, Card, Skeleton, ErrorState } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useSlot } from '@/features/booking/hooks';
import {
  formatSlotTime,
  formatDate,
  formatPrice,
  checkBookingEligibility,
} from '@/features/booking/utils';
import { SPACING } from '@/shared/theme/types';

export default function PTDetailScreen() {
  useScreenView('client_pt_detail');

  const { slotId } = useLocalSearchParams<{ slotId: string }>();
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const { data: slot, isLoading, isError, refetch } = useSlot(slotId ?? '');

  const handleBack = useCallback(() => {
    haptic.selection();
    router.back();
  }, [haptic, router]);

  const handleBook = useCallback(() => {
    if (!slot) return;
    haptic.medium();
    router.push({
      pathname: '/(client)/(booking)/confirm',
      params: { slotId: slot.id },
    } as never);
  }, [slot, haptic, router]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
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

  if (isError || !slot) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.backRow}>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
        </View>
        <ErrorState message="Не удалось загрузить тренировку" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const { eligible, reason } = checkBookingEligibility(slot);
  const isFull = slot.isFull;
  const canWaitlist = isFull && slot.isWaitlistAvailable;
  const priceText = formatPrice(slot.price, slot.currency);
  const ctaTitle = isFull
    ? canWaitlist
      ? 'В лист ожидания'
      : 'Мест нет'
    : `Записаться — ${priceText}`;
  const ctaDisabled = !eligible && !canWaitlist;

  // Calculate duration in minutes
  const [startH, startM] = slot.startTime.split(':').map(Number);
  const [endH, endM] = slot.endTime.split(':').map(Number);
  const durationMin = (endH * 60 + endM) - (startH * 60 + startM);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <View style={styles.backRow}>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{slot.title}</Text>
          <Text style={styles.dateTime}>
            {formatDate(slot.date)} · {formatSlotTime(slot)}
          </Text>
        </View>

        {/* Trainer card */}
        <Card style={styles.trainerCard}>
          <View style={styles.trainerRow}>
            <View
              style={[
                styles.trainerAvatar,
                { backgroundColor: colors.accent.surface },
              ]}
            >
              <Text style={styles.trainerAvatarText}>
                {slot.trainerName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.trainerInfo}>
              <Text style={styles.trainerName}>{slot.trainerName}</Text>
              <Text style={styles.trainerLabel}>Персональный тренер</Text>
            </View>
          </View>
        </Card>

        {/* Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Длительность</Text>
            <Text style={styles.detailValue}>{durationMin} мин</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Зал</Text>
            <Text style={styles.detailValue}>{slot.room}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Стоимость</Text>
            <Text style={styles.priceValue}>{priceText}</Text>
          </View>
        </View>

        {/* Description */}
        {slot.description ? (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>{slot.description}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        {ctaDisabled && reason ? (
          <Text style={styles.reasonText}>{reason}</Text>
        ) : null}
        <Button
          title={ctaTitle}
          onPress={handleBook}
          variant={canWaitlist ? 'secondary' : 'primary'}
          disabled={ctaDisabled}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING[8],
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
  header: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[2],
    marginBottom: SPACING[5],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  dateTime: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  trainerCard: {
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[5],
    padding: SPACING[4],
  },
  trainerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  trainerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  trainerAvatarText: {
    ...t.typography.h3,
    color: t.colors.text.accent,
  },
  trainerInfo: {
    flex: 1,
    gap: 2,
  },
  trainerName: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  trainerLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  detailsSection: {
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[5],
    gap: SPACING[3],
  },
  detailRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  detailLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  detailValue: {
    ...t.typography.body,
    color: t.colors.text.primary,
    fontWeight: '500' as const,
  },
  priceValue: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  descriptionSection: {
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[5],
  },
  descriptionText: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  bottomCta: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[3],
    paddingBottom: SPACING[2],
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
    backgroundColor: t.colors.bg.primary,
    gap: SPACING[2],
  },
  reasonText: {
    ...t.typography.caption,
    color: t.colors.semantic.error.main,
    textAlign: 'center' as const,
  },
  skeletons: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
}));
