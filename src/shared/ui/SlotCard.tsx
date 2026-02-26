import { View, Text } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import type { ScheduleSlot } from '@/features/booking/types';
import {
  formatSlotTime,
  getAvailableSpots,
  checkBookingEligibility,
  formatPrice,
} from '@/features/booking/utils';
import { pluralize } from '@/shared/lib/pluralize';

interface SlotCardProps {
  slot: ScheduleSlot;
  onPress: (slot: ScheduleSlot) => void;
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  all: 'Все уровни',
};

export function SlotCard({ slot, onPress }: SlotCardProps) {
  const styles = useStyles();
  const { colors, name: themeName } = useTheme();
  const spots = getAvailableSpots(slot);
  const { eligible, reason } = checkBookingEligibility(slot);

  const isFull = slot.isFull;
  const canWaitlist = isFull && slot.isWaitlistAvailable;

  const ctaTitle = isFull
    ? canWaitlist
      ? 'Лист ожидания'
      : 'Мест нет'
    : 'Записаться';

  const ctaVariant = isFull
    ? canWaitlist
      ? ('secondary' as const)
      : ('secondary' as const)
    : ('primary' as const);

  const ctaDisabled = !eligible && !canWaitlist;

  return (
    <Card onPress={() => onPress(slot)} style={styles.card}>
      <View style={styles.row}>
        {/* Left accent stripe */}
        {themeName === 'kinetic' ? (
          <View style={[styles.stripe, { backgroundColor: colors.accent.primary }]} />
        ) : (
          <View style={styles.dotContainer}>
            <View style={[styles.dot, { backgroundColor: colors.accent.primary }]} />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.time}>{formatSlotTime(slot)}</Text>
            {slot.level && (
              <Badge text={LEVEL_LABELS[slot.level] ?? slot.level} variant="info" />
            )}
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {slot.title}
          </Text>
          <Text style={styles.trainer} numberOfLines={1}>
            {slot.trainerName}
          </Text>
          <Text style={styles.meta}>
            {slot.room} · {spots} {pluralize(spots, ['место', 'места', 'мест'])}
          </Text>
        </View>

        {/* Right side: price + CTA */}
        <View style={styles.right}>
          {slot.price > 0 && (
            <Text style={styles.price}>{formatPrice(slot.price, slot.currency)}</Text>
          )}
          <Button
            title={ctaTitle}
            onPress={() => onPress(slot)}
            variant={ctaVariant}
            size="small"
            disabled={ctaDisabled}
            style={styles.cta}
          />
        </View>
      </View>
    </Card>
  );
}

const useStyles = createStyles((t) => ({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  stripe: {
    width: 4,
    borderRadius: 2,
    alignSelf: 'stretch' as const,
    marginRight: 12,
  },
  dotContainer: {
    width: 4,
    alignSelf: 'stretch' as const,
    marginRight: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  time: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  title: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
  },
  trainer: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  meta: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  right: {
    alignItems: 'flex-end' as const,
    justifyContent: 'center' as const,
    marginLeft: 12,
    gap: 6,
  },
  price: {
    ...t.typography.bodySm,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  cta: {
    minWidth: 100,
  },
}));
