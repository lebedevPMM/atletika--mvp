import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Button, Card, Badge, Skeleton, ErrorState } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useSlot } from '@/features/booking/hooks';
import {
  formatSlotTime,
  formatDate,
  formatPrice,
  getAvailableSpots,
  checkBookingEligibility,
} from '@/features/booking/utils';
import { pluralize } from '@/shared/lib/pluralize';
import { SPACING } from '@/shared/theme/types';

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  all: 'Все уровни',
};

export default function ClassDetailScreen() {
  useScreenView('client_class_detail');

  const { classId } = useLocalSearchParams<{ classId: string }>();
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const { data: slot, isLoading, isError, refetch } = useSlot(classId ?? '');

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
        <ErrorState message="Не удалось загрузить занятие" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const spots = getAvailableSpots(slot);
  const { eligible, reason } = checkBookingEligibility(slot);
  const spotsRatio = slot.capacity > 0 ? slot.booked / slot.capacity : 0;

  const isFull = slot.isFull;
  const canWaitlist = isFull && slot.isWaitlistAvailable;
  const ctaTitle = isFull
    ? canWaitlist
      ? 'В лист ожидания'
      : 'Мест нет'
    : 'Записаться';
  const ctaDisabled = !eligible && !canWaitlist;

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
          {slot.level && (
            <Badge
              text={LEVEL_LABELS[slot.level] ?? slot.level}
              variant="info"
            />
          )}
          <Text style={styles.dateTime}>
            {formatDate(slot.date)} · {formatSlotTime(slot)}
          </Text>
        </View>

        {/* Info cards */}
        <View style={styles.cardsSection}>
          {/* Trainer card */}
          <Card style={styles.infoCard}>
            <Text style={styles.cardLabel}>Тренер</Text>
            <Text style={styles.cardValue}>{slot.trainerName}</Text>
          </Card>

          {/* Room card */}
          <Card style={styles.infoCard}>
            <Text style={styles.cardLabel}>Зал</Text>
            <Text style={styles.cardValue}>{slot.room}</Text>
          </Card>

          {/* Spots card */}
          <Card style={styles.infoCard}>
            <Text style={styles.cardLabel}>Места</Text>
            <Text style={styles.cardValue}>
              {spots} / {slot.capacity}{' '}
              {pluralize(spots, ['место', 'места', 'мест'])}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(spotsRatio * 100, 100)}%` as unknown as number,
                    backgroundColor:
                      spotsRatio >= 0.9
                        ? colors.semantic.error.main
                        : spotsRatio >= 0.7
                          ? colors.semantic.warning.main
                          : colors.accent.primary,
                  },
                ]}
              />
            </View>
          </Card>
        </View>

        {/* Description */}
        {slot.description ? (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>{slot.description}</Text>
          </View>
        ) : null}

        {/* Price */}
        {slot.price > 0 && (
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Стоимость</Text>
            <Text style={styles.priceValue}>
              {formatPrice(slot.price, slot.currency)}
            </Text>
          </View>
        )}
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
  cardsSection: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[3],
    marginBottom: SPACING[5],
  },
  infoCard: {
    padding: SPACING[4],
  },
  cardLabel: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    marginBottom: SPACING[1],
  },
  cardValue: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: t.colors.bg.sunken,
    borderRadius: t.radius.full,
    marginTop: SPACING[2],
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: 6,
    borderRadius: t.radius.full,
  },
  descriptionSection: {
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[5],
  },
  descriptionText: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  priceSection: {
    paddingHorizontal: SPACING[4],
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: SPACING[4],
  },
  priceLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  priceValue: {
    ...t.typography.h3,
    color: t.colors.text.primary,
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
  skeletons: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  reasonText: {
    ...t.typography.caption,
    color: t.colors.semantic.error.main,
    textAlign: 'center' as const,
  },
}));
