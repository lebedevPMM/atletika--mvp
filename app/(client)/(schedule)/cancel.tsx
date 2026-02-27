import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Card, Button } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useCancelBooking } from '@/features/booking/hooks';
import { formatBookingDateTime, isCancelDeadlinePassed } from '@/features/booking/utils';
import { SPACING } from '@/shared/theme/types';

const PRESET_REASONS = [
  'Изменились планы',
  'Плохое самочувствие',
  'Нашел другое занятие',
  'Другая причина',
];

type CancelParams = {
  bookingId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerName: string;
  cancelDeadline: string;
};

export default function CancelBookingScreen() {
  useScreenView('client_booking_cancel');

  const params = useLocalSearchParams<CancelParams>();
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');

  const cancelBooking = useCancelBooking();

  const deadlinePassed = isCancelDeadlinePassed(params.cancelDeadline || undefined);
  const dateTimeFormatted = formatBookingDateTime(
    params.date ?? '',
    params.startTime ?? '',
    params.endTime ?? '',
  );

  const handleBack = useCallback(() => {
    haptic.selection();
    router.back();
  }, [haptic, router]);

  const handleSelectReason = useCallback(
    (reason: string) => {
      haptic.selection();
      setSelectedReason(reason === selectedReason ? null : reason);
      if (reason !== 'Другая причина') {
        setCustomReason('');
      }
    },
    [haptic, selectedReason],
  );

  const handleConfirmCancel = useCallback(async () => {
    if (!params.bookingId) return;

    const reason =
      selectedReason === 'Другая причина'
        ? customReason || 'Другая причина'
        : selectedReason ?? undefined;

    try {
      await cancelBooking.mutateAsync({ bookingId: params.bookingId, reason });
      haptic.success();
      Alert.alert('Готово', 'Запись успешно отменена', [
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
        error instanceof Error ? error.message : 'Не удалось отменить запись',
      );
    }
  }, [params.bookingId, selectedReason, customReason, cancelBooking, haptic, router]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Отмена записи</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Booking summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{params.title}</Text>
          <Text style={styles.summaryDateTime}>{dateTimeFormatted}</Text>
          <Text style={styles.summaryTrainer}>{params.trainerName}</Text>
        </Card>

        {/* Cancel deadline info */}
        {deadlinePassed ? (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Срок бесплатной отмены истек
            </Text>
          </View>
        ) : params.cancelDeadline ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Отмена возможна до{' '}
              {new Date(params.cancelDeadline).toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ) : null}

        {/* Reason selection */}
        <View style={styles.reasonSection}>
          <Text style={styles.reasonLabel}>Причина отмены (необязательно)</Text>
          <View style={styles.chipsContainer}>
            {PRESET_REASONS.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <Pressable
                  key={reason}
                  onPress={() => handleSelectReason(reason)}
                  style={[
                    styles.chip,
                    isSelected && { backgroundColor: colors.accent.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && { color: colors.text.inverse },
                    ]}
                  >
                    {reason}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {selectedReason === 'Другая причина' && (
            <TextInput
              style={styles.textInput}
              placeholder="Опишите причину..."
              placeholderTextColor={colors.text.tertiary}
              value={customReason}
              onChangeText={setCustomReason}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          )}
        </View>

        {/* Confirm button */}
        <Button
          title="Подтвердить отмену"
          onPress={handleConfirmCancel}
          variant="danger"
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
  summaryCard: {
    padding: SPACING[4],
    gap: SPACING[2],
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
  warningBox: {
    backgroundColor: t.colors.semantic.error.surface,
    borderRadius: t.radius.md,
    padding: SPACING[4],
  },
  warningText: {
    ...t.typography.bodySm,
    color: t.colors.semantic.error.main,
    textAlign: 'center' as const,
  },
  infoBox: {
    backgroundColor: t.colors.semantic.info.surface,
    borderRadius: t.radius.md,
    padding: SPACING[4],
  },
  infoText: {
    ...t.typography.bodySm,
    color: t.colors.semantic.info.main,
    textAlign: 'center' as const,
  },
  reasonSection: {
    gap: SPACING[3],
  },
  reasonLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  chipsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: SPACING[2],
  },
  chip: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.bg.elevated,
    borderWidth: 1,
    borderColor: t.colors.border.default,
  },
  chipText: {
    ...t.typography.bodySm,
    color: t.colors.text.primary,
  },
  textInput: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border.default,
    padding: SPACING[4],
    minHeight: 80,
    ...t.typography.body,
    color: t.colors.text.primary,
  },
}));
