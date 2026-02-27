import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { Card, Button } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useCancelBooking } from '@/features/booking/hooks';
import { formatBookingDateTime } from '@/features/booking/utils';
import { SPACING } from '@/shared/theme/types';

type WaitlistParams = {
  bookingId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerName: string;
};

const WAITLIST_INFO = [
  { icon: '🔔', text: 'Мы уведомим вас при появлении места' },
  { icon: '⏱', text: 'У вас будет 15 минут для подтверждения' },
  { icon: '➡️', text: 'Если вы не подтвердите, место перейдет следующему' },
];

export default function WaitlistScreen() {
  useScreenView('client_booking_waitlist');

  const params = useLocalSearchParams<WaitlistParams>();
  const router = useRouter();
  const styles = useStyles();
  const haptic = useHaptic();

  const cancelBooking = useCancelBooking();

  const dateTimeFormatted = formatBookingDateTime(
    params.date ?? '',
    params.startTime ?? '',
    params.endTime ?? '',
  );

  const handleBack = useCallback(() => {
    haptic.selection();
    router.back();
  }, [haptic, router]);

  const handleLeaveWaitlist = useCallback(async () => {
    if (!params.bookingId) return;

    try {
      await cancelBooking.mutateAsync({ bookingId: params.bookingId });
      haptic.success();
      Alert.alert('Готово', 'Вы покинули лист ожидания', [
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
        error instanceof Error ? error.message : 'Не удалось покинуть очередь',
      );
    }
  }, [params.bookingId, cancelBooking, haptic, router]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Лист ожидания</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking info card */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>{params.title}</Text>
          <Text style={styles.cardDateTime}>{dateTimeFormatted}</Text>
          <Text style={styles.cardTrainer}>{params.trainerName}</Text>

          <View style={styles.divider} />

          <View style={styles.positionRow}>
            <Text style={styles.positionLabel}>Позиция</Text>
            <Text style={styles.positionValue}>3 из 5</Text>
          </View>
          <View style={styles.positionRow}>
            <Text style={styles.positionLabel}>Уведомление</Text>
            <Text style={styles.positionValue}>За 1 час до начала</Text>
          </View>
        </Card>

        {/* How waitlist works */}
        <View style={styles.howSection}>
          <Text style={styles.howTitle}>Как работает лист ожидания</Text>
          <View style={styles.bulletList}>
            {WAITLIST_INFO.map((item, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bulletIcon}>{item.icon}</Text>
                <Text style={styles.bulletText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Leave waitlist button */}
        <Button
          title="Покинуть очередь"
          onPress={handleLeaveWaitlist}
          variant="secondary"
          loading={cancelBooking.isPending}
        />
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
  },
  infoCard: {
    padding: SPACING[4],
    gap: SPACING[2],
  },
  cardTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  cardDateTime: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  cardTrainer: {
    ...t.typography.bodySm,
    color: t.colors.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: t.colors.border.default,
    marginVertical: SPACING[2],
  },
  positionRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  positionLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  positionValue: {
    ...t.typography.body,
    color: t.colors.text.primary,
    fontWeight: '500' as const,
  },
  howSection: {
    gap: SPACING[3],
  },
  howTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  bulletList: {
    gap: SPACING[3],
  },
  bulletRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: SPACING[3],
  },
  bulletIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
  bulletText: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    flex: 1,
  },
}));
